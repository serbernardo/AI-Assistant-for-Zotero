// Uso: node tests/harness/figuras/run_figuras.js a.pdf b.pdf  (recortes em tests/harness/out/figuras, nao versionados)
// Mede a deteção de figuras e tabelas: corre o pdf.js no Chromium, como no leitor do Zotero
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const DIR = __dirname, PDFJS = path.join(__dirname, "..", "node_modules", "pdfjs-dist", "build");
const pdfs = process.argv.slice(2);
const srv = http.createServer((q, r) => {
	const u = decodeURIComponent(q.url.split("?")[0]);
	let f = u.startsWith("/pdfjs/") ? path.join(PDFJS, u.slice(7)) : u.startsWith("/pdf/") ? pdfs[+u.slice(5)] : path.join(DIR, u);
	if (u === "/") { r.setHeader("content-type", "text/html"); return r.end("<!doctype html><script src='/figures.js'></script>"); }
	try { const b = fs.readFileSync(f); r.setHeader("content-type", f.endsWith("js") || f.endsWith("mjs") ? "text/javascript" : "application/pdf"); r.end(b); } catch (e) { r.statusCode = 404; r.end(); }
}).listen(0, async () => {
	const port = srv.address().port;
	const b = await chromium.launch(); const page = await b.newPage();
	page.on("console", m => { if (m.type() === "error") console.log("consola:", m.text()); });
	await page.goto(`http://localhost:${port}/`);
	const OUT = path.join(DIR, "..", "out", "figuras"); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT);
	let total = 0;
	for (let d = 0; d < pdfs.length; d++) {
		const res = await page.evaluate(async ({ d }) => {
			const pdfjs = await import("/pdfjs/pdf.mjs");
			pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.mjs";
			const doc = await pdfjs.getDocument("/pdf/" + d).promise;
			const out = [];
			for (let p = 1; p <= doc.numPages; p++) {
				const pg = await doc.getPage(p);
				const vp = pg.getViewport({ scale: 1 });
				const W = vp.width, H = vp.height;
				const tc = await pg.getTextContent();
				const items = tc.items.filter(i => i.str).map(i => { const [x, y] = vp.convertToViewportPoint(i.transform[4], i.transform[5]); const h = Math.hypot(i.transform[2], i.transform[3]); return { str: i.str, x, top: y - h, w: i.width, h, rot: Math.abs(i.transform[1]) > 0.01 }; });
				// Caixas das imagens: segue a matriz (save/restore/transform)
				const ops = await pg.getOperatorList(); const O = pdfjs.OPS;
				let ctm = [1, 0, 0, 1, 0, 0]; const stack = []; const images = [];
				const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
				for (let k = 0; k < ops.fnArray.length; k++) {
					const fn = ops.fnArray[k], a = ops.argsArray[k];
					if (fn === O.save) stack.push(ctm); else if (fn === O.restore) ctm = stack.pop() || ctm;
					else if (fn === O.transform) ctm = mul(ctm, a);
					else if (fn === O.paintImageXObject || fn === O.paintInlineImageXObject || fn === O.paintImageMaskXObject) {
						const pts = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([u, v]) => vp.convertToViewportPoint(ctm[0] * u + ctm[2] * v + ctm[4], ctm[1] * u + ctm[3] * v + ctm[5]));
						const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
						const box = { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
						if ((box.x1 - box.x0) > 30 && (box.y1 - box.y0) > 30 && (box.x1 - box.x0) < W * 0.98) images.push(box);
					}
				}
				const figs = ZIAFigures.detect({ items, images, W, H });
				if (!figs.length && !images.length) continue;
				const S = 2, cv = document.createElement("canvas"); const v2 = pg.getViewport({ scale: S });
				cv.width = v2.width; cv.height = v2.height;
				await pg.render({ canvasContext: cv.getContext("2d"), viewport: v2 }).promise;
				const crops = figs.map(f => { const b = f.box, c = document.createElement("canvas"); c.width = (b.x1 - b.x0) * S; c.height = (b.y1 - b.y0) * S; c.getContext("2d").drawImage(cv, -b.x0 * S, -b.y0 * S); return Object.assign({ png: c.toDataURL("image/png") }, f); });
				// Vista da página com as caixas (para rever)
				const g = cv.getContext("2d"); g.lineWidth = 4;
				g.strokeStyle = "#1a7f37"; for (const im of images) g.strokeRect(im.x0 * S, im.y0 * S, (im.x1 - im.x0) * S, (im.y1 - im.y0) * S);
				g.strokeStyle = "#d1242f"; for (const f of figs) g.strokeRect(f.box.x0 * S, f.box.y0 * S, (f.box.x1 - f.box.x0) * S, (f.box.y1 - f.box.y0) * S);
				const sm = document.createElement("canvas"); sm.width = cv.width / 2; sm.height = cv.height / 2; sm.getContext("2d").drawImage(cv, 0, 0, sm.width, sm.height);
				out.push({ p, images: images.length, crops, overview: sm.toDataURL("image/png") });
			}
			return out;
		}, { d });
		for (const r of res) {
			fs.writeFileSync(path.join(OUT, `D${d + 1}_p${r.p}_pagina.png`), Buffer.from(r.overview.split(",")[1], "base64"));
			for (const c of r.crops) {
				total++;
				fs.writeFileSync(path.join(OUT, `D${d + 1}_p${r.p}_${c.label.replace(/\W+/g, "_")}.png`), Buffer.from(c.png.split(",")[1], "base64"));
				console.log(`D${d + 1} p${r.p}  ${c.kind.padEnd(6)} ${c.label.padEnd(10)} ${Math.round(c.box.x1 - c.box.x0)}x${Math.round(c.box.y1 - c.box.y0)}  «${c.caption.slice(0, 70)}»`);
			}
			if (!r.crops.length) console.log(`D${d + 1} p${r.p}  (${r.images} imagens, nenhuma legenda)`);
		}
	}
	console.log("total", total);
	await b.close(); srv.close();
});
