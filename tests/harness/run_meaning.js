// Mede a verificação automática do sentido das paráfrases ("a frase da IA diz o mesmo que o PDF?").
//   node run_meaning.js extract      tira os pares (frase da IA, excerto do PDF) das respostas reais em out/ia_real_iaedu
//   IAEDU_API_KEY=<chave> NODE_USE_ENV_PROXY=1 node run_meaning.js run
//        corre os pares certos e os estragados de propósito (out/sentido/estragados.json) e conta acertos
// Um pedido por lote de 15 pares, como faria o addon depois de cada resposta.
const path = require("path");
const fs = require("fs");
const { createEnv } = require("./mockzotero");

const OUT = path.join(__dirname, "out", "sentido");
const SRC = path.join(__dirname, "out", "ia_real_iaedu");
const KEY = (process.env.IAEDU_API_KEY || "").trim();
const BATCH = parseInt(process.env.BATCH, 10) || 15;

async function setup() {
	const env = createEnv({ prefs: { "ui.lang": "pt-PT", engine: "iaedu" } });
	const { core } = env;
	const silva = env.addPaper({ title: "Assistentes conversacionais em bibliotecas universitárias portuguesas", date: "2021-06-01", key: "SILVAPDF",
		creators: [{ lastName: "Silva", firstName: "Ana" }, { lastName: "Costa", firstName: "Rui" }, { lastName: "Reis", firstName: "Marta" }],
		pdf: path.join(__dirname, "silva2021.pdf") });
	const garcia = env.addPaper({ title: "Library chatbots after deployment", date: "2023", key: "GARCIAPDF",
		creators: [{ lastName: "García", firstName: "Lucía" }, { lastName: "Ortega", firstName: "Tomás" }],
		pdf: path.join(__dirname, "garcia2023.pdf") });
	const docs = [];
	for (const p of [silva, garcia]) {
		const d = await core.describeItem(p.parent);
		d.id = "D" + (docs.length + 1);
		await core.loadText(d);
		docs.push(d);
	}
	return { env, core, L: core.lib, docs };
}

async function extract() {
	const { L, docs } = await setup();
	const map = Object.fromEntries(docs.map(d => [d.id, { pages: d.pages }]));
	const pairs = [];
	for (const f of fs.readdirSync(SRC).filter(f => f.endsWith(".md")).sort()) {
		const text = fs.readFileSync(path.join(SRC, f), "utf8");
		const res = L.verifyAnswer(text, map);
		for (const p of L.meaningClaims(text, res)) pairs.push(Object.assign({ id: f.replace(/\.md$/, "") + ":" + p.key + ":" + p.k }, p));
	}
	fs.mkdirSync(OUT, { recursive: true });
	fs.writeFileSync(path.join(OUT, "pares.json"), JSON.stringify(pairs, null, 1));
	console.log(`${pairs.length} pares em ${path.join(OUT, "pares.json")}`);
}

async function run() {
	if (!KEY) { console.error("Falta IAEDU_API_KEY"); process.exit(2); }
	const { core, L } = await setup();
	await core.setSecret("iaedu", KEY);
	if (process.env.IAEDU_ENDPOINT) { core.setPref("iaedu.endpoint", process.env.IAEDU_ENDPOINT.trim()); core.setPref("iaedu.channel", (process.env.IAEDU_CHANNEL || "").trim()); }
	const win = { fetch, AbortController, FormData };
	const good = JSON.parse(fs.readFileSync(path.join(OUT, "pares.json"), "utf8")).map(p => Object.assign({ expect: "yes", kind: "certa" }, p));
	const bad = JSON.parse(fs.readFileSync(path.join(OUT, "estragados.json"), "utf8"));
	const base = Object.fromEntries(good.map(p => [p.id, p]));
	const broken = bad.map(b => ({ id: b.id + "~" + b.kind, kind: b.kind, expect: "not-yes", claim: b.claim, passage: base[b.id].passage, orig: base[b.id].claim }));
	// Mistura certos e estragados (ordem fixa, por um número tirado do id), para o modelo não ver o padrão
	const h = t => [...t].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
	const items = [...good, ...broken].sort((a, b) => h(a.id + a.kind) - h(b.id + b.kind));
	// Continua de onde parou (o IAEdu tem limite de pedidos): o que já tem resposta fica
	const RES = path.join(OUT, "resultados.json");
	const results = fs.existsSync(RES) ? JSON.parse(fs.readFileSync(RES, "utf8")) : [];
	const done = new Set(results.map(r => r.id + r.kind));
	const todo = items.filter(p => !done.has(p.id + p.kind));
	let secs = 0;
	for (let i = 0; i < todo.length; i += BATCH) {
		const chunk = todo.slice(i, i + BATCH);
		const { system, prompt } = L.meaningBatchPrompt(chunk);
		const t0 = Date.now();
		let r;
		for (let tries = 0; ; tries++) {
			try { r = await core.runEngine("iaedu", { system, prompt, win }); break; }
			catch (e) {
				if (e.kind === "limit" && tries < 12) { console.log(`  limite do IAEdu, pausa de 5 min (${new Date().toISOString().slice(11, 16)})`); await new Promise(res => setTimeout(res, 300000)); continue; }
				throw e;
			}
		}
		secs += (Date.now() - t0) / 1000;
		const v = L.parseMeaningBatch(r.text, chunk.length);
		chunk.forEach((p, k) => results.push(Object.assign({}, p, { verdict: v[k] ? v[k].verdict : null, note: v[k] ? v[k].note : "" })));
		fs.writeFileSync(RES, JSON.stringify(results, null, 1));
		if (i + BATCH < todo.length) await new Promise(res => setTimeout(res, (parseInt(process.env.PAUSE, 10) || 20) * 1000));
		console.log(`lote ${i / BATCH + 1}: ${chunk.length} pares, ${((Date.now() - t0) / 1000).toFixed(0)} s, ${v.filter(Boolean).length} respostas lidas`);
	}
	const g = results.filter(r => r.expect === "yes"), b = results.filter(r => r.expect !== "yes");
	const cnt = (arr, v) => arr.filter(r => r.verdict === v).length;
	console.log(`\nCertas (${g.length}): SIM ${cnt(g, "yes")} · EM PARTE ${cnt(g, "partly")} · NÃO ${cnt(g, "no")} · sem resposta ${cnt(g, null)}`);
	console.log(`Estragadas (${b.length}): apanhadas ${b.filter(r => r.verdict && r.verdict !== "yes").length} · passaram como SIM ${cnt(b, "yes")} · sem resposta ${cnt(b, null)}`);
	const kinds = [...new Set(b.map(r => r.kind))];
	for (const k of kinds) {
		const x = b.filter(r => r.kind === k);
		console.log(`  ${k.padEnd(14)} ${x.filter(r => r.verdict && r.verdict !== "yes").length} de ${x.length} apanhadas`);
	}
	console.log(`Tempo nesta execução: ${secs.toFixed(0)} s`);
	console.log("\nCertas marcadas como problema (rever à mão):");
	for (const r of g.filter(r => r.verdict !== "yes")) console.log(`- [${r.verdict}] ${r.id}\n  IA: ${r.claim}\n  PDF: ${r.passage}\n  Nota: ${r.note}`);
	console.log("\nEstragadas que passaram:");
	for (const r of b.filter(r => r.verdict === "yes")) console.log(`- ${r.id}\n  IA: ${r.claim}\n  PDF: ${r.passage}`);
}

(process.argv[2] === "run" ? run : extract)().catch(e => { console.error(e); process.exit(1); });
