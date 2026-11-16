// Mede o extrator de estrutura do PROPRIO Zotero (Zotero.SDT / document-worker) em PDFs reais:
// que tabelas, figuras e legendas encontra, e se da para reconstruir as filas e colunas.
// Precisa de um clone do document-worker (nao vai no repositorio):
//   git clone --recursive https://github.com/zotero/document-worker dw && cd dw && npm ci
//   mkdir -p build/cmaps build/standard_fonts build/wasm build/onnx build/block-seg/clusterer build/block-seg/classifier
//   cp -r pdf.js/external/bcmaps/. build/cmaps/ ; cp -r pdf.js/external/standard_fonts/. build/standard_fonts/
//   cp pdf.js/external/openjpeg/openjpeg.wasm pdf.js/external/jbig2/jbig2.wasm build/wasm/
//   cp node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm build/onnx/
//   cp src/pdf/structure/model/block-seg/clusterer/{model.onnx,repair.onnx,runtime.bin} build/block-seg/clusterer/
//   cp src/pdf/structure/model/block-seg/classifier/{model.onnx,stats.bin} build/block-seg/classifier/
// Depois, com este ficheiro copiado para dentro do clone:
//   node --import ./scripts/pdfjs-setup.js --import tsx run_sdt.mjs a.pdf b.pdf     (FIGS=1 lista as imagens)
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getStructure } from "./src/pdf/index.js";
import { parseTextMap, reconstructCharPositions } from "./structured-document-text/src/pdf/decode.js";

const dataProvider = p => fs.readFileSync(path.join(import.meta.dirname, "build", p));
const md5 = b => crypto.createHash("md5").update(b).digest("hex");

const flatText = n => {
	if (!n) return "";
	if (typeof n === "string") return n;
	if (Array.isArray(n)) return n.map(flatText).join("");
	if (n.text != null) return String(n.text);
	return flatText(n.content || []);
};

const pageOf = n => {
	const r = n && n.anchor && n.anchor.pageRects && n.anchor.pageRects[0];
	return r ? r[0] + 1 : null;
};

/** Caracteres de um bloco com posicao: [{ ch, x1, x2, y, page }] */
function charsOf(block) {
	const out = [];
	for (const node of (block.content || [])) {
		// As posicoes correspondem aos caracteres SEM espacos (os espacos sao postos pelo extrator)
		const glyphs = [...String(node.text || "")].filter(c => !/\s/.test(c));
		const runs = parseTextMap(node.anchor && node.anchor.textMap);
		let i = 0;
		for (const run of runs) {
			const pageIndex = run[1], minY = run[3], maxY = run[5];
			const y = (minY + maxY) / 2;
			for (const p of reconstructCharPositions(run)) {
				out.push({ ch: glyphs[i] != null ? glyphs[i] : " ", x1: p.x1, x2: p.x2, y, h: maxY - minY, page: pageIndex + 1 });
				i++;
			}
		}
	}
	return out;
}

/** Filas e celulas a partir dos caracteres: agrupa por linha, corta nos espacos largos e alinha colunas por x. */
function grid(chars) {
	const sizes = chars.map(c => c.h).sort((a, b) => a - b);
	const h = sizes[sizes.length >> 1] || 8;
	const lines = [];
	for (const c of chars.sort((a, b) => b.y - a.y || a.x1 - b.x1)) {
		const l = lines.find(l => Math.abs(l.y - c.y) < Math.max(1.5, c.h * 0.4) && l.page === c.page);
		if (l) { l.chars.push(c); l.y = (l.y * (l.chars.length - 1) + c.y) / l.chars.length; }
		else lines.push({ y: c.y, page: c.page, chars: [c] });
	}
	// Celulas: um intervalo maior do que GAP corta; menor mas visivel e um espaco dentro da celula
	const GAP = h * 0.9, SP = h * 0.18;
	const rows = lines.map(l => {
		l.chars.sort((a, b) => a.x1 - b.x1);
		const cells = [];
		let cur = "", from = null, prev = null;
		for (const c of l.chars) {
			if (prev) {
				const d = c.x1 - prev.x2;
				if (d > GAP) { cells.push({ text: cur.trim(), x: from, x2: prev.x2 }); cur = ""; from = null; }
				else if (d > SP) cur += " ";
			}
			if (from === null) from = c.x1;
			cur += c.ch;
			prev = c;
		}
		if (cur.trim()) cells.push({ text: cur.trim(), x: from, x2: prev.x2 });
		return { y: l.y, page: l.page, cells };
	}).filter(r => r.cells.length);
	// Colunas: junta os inicios de celula parecidos (dentro de 1,5 letras)
	const starts = [];
	for (const r of rows) for (const c of r.cells) {
		const s = starts.find(s => Math.abs(s.x - c.x) < h * 1.5);
		if (s) { s.n++; s.x = (s.x * (s.n - 1) + c.x) / s.n; } else starts.push({ x: c.x, n: 1 });
	}
	starts.sort((a, b) => a.x - b.x);
	const col = c => { let k = 0; for (let i = 0; i < starts.length; i++) if (Math.abs(starts[i].x - c.x) < Math.abs(starts[k].x - c.x)) k = i; return k; };
	const table = rows.map(r => {
		const out = new Array(starts.length).fill("");
		for (const c of r.cells) { const k = col(c); out[k] = out[k] ? out[k] + " " + c.text : c.text; }
		return out;
	});
	// Fila de continuacao (so uma celula preenchida, sem numeros): junta a fila de cima
	const merged = [];
	for (const r of table) {
		const filled = r.filter(Boolean).length;
		const prev = merged[merged.length - 1];
		if (prev && filled <= Math.max(1, Math.ceil(r.length / 4)) && !r.some(c => /\d/.test(c))) {
			r.forEach((c, i) => { if (c) prev[i] = (prev[i] ? prev[i] + " " : "") + c; });
			continue;
		}
		merged.push(r.slice());
	}
	return { rows: merged, cols: starts.length };
}

for (const file of process.argv.slice(2)) {
	const name = path.basename(file).slice(0, 38);
	const buf = fs.readFileSync(file);
	const t0 = Date.now();
	let st;
	try { st = await getStructure(new Uint8Array(buf).buffer, "", dataProvider, { sourceHash: md5(buf) }); }
	catch (e) { console.log(`\n### ${name}\nFALHOU: ${e.message}`); continue; }
	const secs = ((Date.now() - t0) / 1000).toFixed(1);
	const content = st.content || [];
	const tables = [], images = [], caps = [];
	content.forEach((n, i) => {
		if (n.type === "table") tables.push({ n, i });
		else if (n.type === "image") images.push({ n, i });
		else if (n.type === "caption") caps.push({ n, i });
	});
	console.log(`\n### ${name}  (${secs}s)  tabelas ${tables.length} · imagens ${images.length} · legendas ${caps.length}`);
	for (const { n, i } of tables) {
		// Legenda: o bloco caption mais proximo (antes ou depois) na mesma pagina
		const p = pageOf(n);
		const cap = caps.map(c => ({ c, d: Math.abs(c.i - i) })).filter(x => pageOf(x.c.n) === p).sort((a, b) => a.d - b.d)[0];
		const g = grid(charsOf(n));
		const rows = g.rows, cols = g.cols;
		console.log(`\n  TABELA p${p} · «${cap ? flatText(cap.c.n).slice(0, 60) : "(sem legenda)"}»`);
		console.log(`  ${rows.length} filas, ate ${cols} colunas`);
		for (const r of rows.slice(0, 4)) console.log("     | " + r.map(c => String(c).slice(0, 20)).join(" | "));
		if (rows.length > 4) console.log("     …");
	}
	if (process.env.FIGS) for (const { n, i } of images) {
		const p = pageOf(n);
		const cap = caps.map(c => ({ c, d: Math.abs(c.i - i) })).filter(x => pageOf(x.c.n) === p).sort((a, b) => a.d - b.d)[0];
		console.log(`  imagem p${p} · «${cap ? flatText(cap.c.n).slice(0, 60) : "(sem legenda)"}»`);
	}
}
