/* Corre dentro de um Zotero real: testa o Assistente IA com uma IA simulada e escreve os resultados em ZIA_TEST_OUT. */
var results = [];
var outPath;

function log(ok, name, detail) {
	results.push({ ok, name, detail: detail == null ? "" : String(detail) });
	Zotero.debug("ZIA-TEST " + (ok ? "OK " : "FALHOU ") + name + (detail ? " :: " + detail : ""));
}

async function step(name, fn) {
	try {
		const d = await fn();
		log(true, name, d);
		return true;
	}
	catch (e) {
		log(false, name, (e && e.message || e) + (e && e.stack ? "\n" + e.stack.split("\n").slice(0, 4).join("\n") : ""));
		return false;
	}
}

const sleep = ms => Zotero.Promise.delay(ms);
async function until(fn, ms = 15000, what = "condição") {
	const t0 = Date.now();
	for (;;) {
		let v;
		try { v = await fn(); } catch (e) { v = null; }
		if (v) return v;
		if (Date.now() - t0 > ms) throw new Error("tempo esgotado: " + what);
		await sleep(150);
	}
}
function assert(c, msg) { if (!c) throw new Error(msg); }

async function write() {
	await IOUtils.writeUTF8(outPath, JSON.stringify({ zotero: Zotero.version, results }, null, 1));
}

const FAKE = "O excerto diz que os assistentes ajudam os utilizadores [D1:p1].\n\n"
	+ "| Aspeto | Valor |\n| --- | --- |\n| Amostra | 12 bibliotecas [D1:p1] |\n";

async function run() {
	outPath = Services.env.get("ZIA_TEST_OUT");
	const pdfDir = Services.env.get("ZIA_TEST_PDFS");
	await Zotero.initializationPromise;
	await Zotero.uiReadyPromise;
	const win = Zotero.getMainWindow();
	const ZP = win.ZoteroPane;
	let IA, parent, att, view;

	await step("addon carregado", async () => {
		IA = await until(() => Zotero.ZoteroIA, 20000, "Zotero.ZoteroIA");
		return "Zotero " + Zotero.version + ";
	});
	if (!IA) return;

	// IA simulada: nada sai da máquina
	IA.setPref("engine", "gemini");
	IA.setPref("privacy.ack.gemini", true);
	IA.isEngineReady = () => true;
	IA.calls = [];
	IA.runEngine = async (engine, opts) => {
		IA.calls.push(opts.prompt || "");
		const text = /SIM|NAO|EM PARTE/.test(opts.prompt || "") && /lote|citac/i.test(opts.system || "") ? "1: SIM: igual" : FAKE;
		if (opts.onDelta) opts.onDelta(text, text);
		return { text, model: "simulado" };
	};

	await step("importar PDF com registo-pai", async () => {
		parent = new Zotero.Item("journalArticle");
		parent.libraryID = Zotero.Libraries.userLibraryID;
		parent.setField("title", "Assistentes conversacionais em bibliotecas");
		parent.setField("date", "2021");
		parent.setCreators([{ firstName: "Ana", lastName: "Silva", creatorType: "author" }]);
		await parent.saveTx();
		att = await Zotero.Attachments.importFromFile({ file: PathUtils.join(pdfDir, "silva2021.pdf"), parentItemID: parent.id });
		assert(att && att.isPDFAttachment(), "anexo não é PDF");
		return "registo " + parent.id + ", PDF " + att.id;
	});

	await step("ler o texto do PDF (PDFWorker)", async () => {
		const doc = await IA.describeItem(parent);
		const r = await IA.loadText(doc);
		const pages = (r && r.pages) || doc.pages || [];
		assert(pages.length >= 1, "sem páginas");
		return pages.length + " páginas";
	});

	await step("painel lateral aparece ao escolher o registo", async () => {
		await ZP.selectItem(parent.id);
		view = await until(() => [...IA.views].find(v => v.mode === "section" && v.sessionKey === "item:" + parent.id && v.root && v.root.isConnected), 20000, "vista do painel");
		await until(() => view.state.docs.length, 15000, "documento no painel");
		const r = view.root.getBoundingClientRect();
		return "largura " + Math.round(r.width) + " px";
	});

	await step("pergunta com resposta simulada, verificação e citação", async () => {
		view.textarea.value = "O que diz o artigo?";
		await view.sendQuestion();
		await until(() => !view.busy, 20000, "fim da resposta");
		const m = view.state.messages.find(x => x.role === "assistant");
		assert(m && !m.error, "resposta com erro: " + (m && m.error));
		assert(m.el && m.el.isConnected, "resposta não está no ecrã");
		assert(m.el.querySelector(".zia-cite"), "sem citação clicável");
		return "check: " + JSON.stringify(m.check && m.check.cites);
	});

	await step("guardar como nota", async () => {
		const m = view.state.messages.find(x => x.role === "assistant");
		const before = parent.getNotes().length;
		const btn = [...m.el.querySelectorAll("button")].find(b => /nota|note/i.test(b.textContent + b.title));
		assert(btn, "sem botão de nota");
		btn.click();
		await until(() => parent.getNotes().length > before, 10000, "nota criada");
		return "notas: " + parent.getNotes().length;
	});

	await step("apagar a resposta", async () => {
		const n = view.state.messages.length;
		const m = view.state.messages.find(x => x.role === "assistant");
		view._removeMessage(m);
		assert(view.state.messages.length === n - 2, "não apagou");
	});

	let reader;
	await step("abrir o PDF no leitor", async () => {
		reader = await Zotero.Reader.open(att.id);
		await until(() => reader && reader._internalReader && reader._iframeWindow, 30000, "leitor pronto");
		return "separador " + reader.tabID;
	});

	const explain = async label => {
		const doc = reader._iframeWindow.document;
		const holder = doc.createElement("div");
		doc.body.appendChild(holder);
		IA.onTextSelectionPopup({
			reader, doc,
			params: { annotation: { text: "Os assistentes conversacionais " + label, position: { pageIndex: 0 }, pageLabel: "1" } },
			append: el => holder.appendChild(el),
		});
		const btn = holder.querySelector("button");
		assert(btn, "botão Explicar isto não foi criado");
		const before = IA.calls.length;
		btn.dispatchEvent(new reader._iframeWindow.MouseEvent("click", { bubbles: true, button: 0 }));
		await until(() => IA.calls.length > before, 20000, "pedido enviado");
		const v = await until(() => [...IA.views].find(x => x.busy === false && x.state.messages.some(m => m.role === "user" && String(m.display).includes(label))), 20000, "explicação no painel");
		holder.remove();
		return { btn, v };
	};

	await step("Explicar isto no leitor", async () => {
		const { v } = await explain("(1.a vez)");
		return "vista " + v.mode;
	});

	await step("Explicar isto depois de apagar a resposta", async () => {
		const v = [...IA.views].find(x => x.state.messages.some(m => m.role === "assistant"));
		const m = v.state.messages.filter(x => x.role === "assistant").pop();
		v._removeMessage(m);
		await explain("(2.a vez)");
	});

	await step("Explicar isto duas vezes no mesmo botão", async () => {
		const doc = reader._iframeWindow.document;
		const holder = doc.createElement("div");
		doc.body.appendChild(holder);
		IA.onTextSelectionPopup({ reader, doc, params: { annotation: { text: "botão reutilizado", position: { pageIndex: 0 } } }, append: el => holder.appendChild(el) });
		const btn = holder.querySelector("button");
		for (let i = 0; i < 2; i++) {
			const before = IA.calls.length;
			btn.dispatchEvent(new reader._iframeWindow.MouseEvent("click", { bubbles: true, button: 0 }));
			await until(() => IA.calls.length > before, 20000, "pedido " + (i + 1));
			await until(() => ![...IA.views].some(x => x.busy), 20000, "fim");
		}
		holder.remove();
	});

	await step("janela do assistente abre com o artigo", async () => {
		const w = IA.openWindow({ items: [parent] });
		const zw = await until(() => {
			const x = Services.wm.getMostRecentWindow(IA.WINDOW_TYPE);
			return x && x.ZIAWindow && x.ZIAWindow.view && x.ZIAWindow.view.state.docs.length && x;
		}, 30000, "janela com o artigo");
		const n = zw.ZIAWindow.view.state.docs.length;
		zw.close();
		return n + " artigo(s)";
	});

	await step("definições abrem sem erros", async () => {
		win.openPreferences && win.openPreferences(null);
		await sleep(3000);
		const pw = Services.wm.getMostRecentWindow("zotero:pref");
		assert(pw, "janela das definições não abriu");
		const root = await until(() => pw.document.getElementById("zoteroia-prefs-root") || pw.document.querySelector("[id^=zia]"), 15000, "secção do addon nas definições");
		pw.close();
		return root.id;
	});
}

function startup() {
	(async () => {
		try { await run(); }
		catch (e) { log(false, "erro geral", e && e.stack || e); }
		try { await write(); } catch (e) { dump("ZIA-TEST não escreveu: " + e + "\n"); }
		if (Services.env.get("ZIA_TEST_KEEP") !== "1") Services.startup.quit(Ci.nsIAppStartup.eForceQuit);
	})();
}
function shutdown() {}
function install() {}
function uninstall() {}
