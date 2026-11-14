// Deteção de figuras e tabelas numa página, a partir do texto com posições (pdf.js getTextContent)
// e das caixas das imagens. Lógica pura: coordenadas de cima para baixo, em pontos do PDF.
// items: [{ str, x, top, w, h }]  images: [{ x0, y0, x1, y1 }]  W, H: tamanho da página
(function (root) {
	const CAPTION = /^\s*(fig\.?|figure|figura|table|tabela|tab\.|quadro|chart|gráfico|grafico)\s*(\d+|[ivx]+)\b\s*([.:|\-–—]?)\s*(.*)$/i;

	function lines(items) {
		const ls = [];
		for (const it of items.filter(i => i.str.trim()).sort((a, b) => a.top - b.top || a.x - b.x)) {
			const l = ls.find(l => Math.abs(l.top - it.top) < Math.max(2, it.h * 0.35) && it.x >= l.x0 - 2 && it.x - l.x1 < Math.max(6, it.h * 1.6));
			if (l) { l.items.push(it); l.x0 = Math.min(l.x0, it.x); l.x1 = Math.max(l.x1, it.x + it.w); l.bottom = Math.max(l.bottom, it.top + it.h); l.h = Math.max(l.h, it.h); }
			else ls.push({ items: [it], x0: it.x, x1: it.x + it.w, top: it.top, bottom: it.top + it.h, h: it.h });
		}
		for (const l of ls) {
			l.items.sort((a, b) => a.x - b.x);
			l.text = l.items.map(i => i.str).join(" ").replace(/\s+/g, " ").trim();
			let gap = 0;
			for (let k = 1; k < l.items.length; k++) gap = Math.max(gap, l.items[k].x - (l.items[k - 1].x + l.items[k - 1].w));
			l.maxGap = gap;
		}
		return ls.sort((a, b) => a.top - b.top);
	}

	function median(a) { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; }

	function detect(page) {
		const { items, images = [], W, H } = page;
		const ls = lines(items.filter(i => !i.rot && i.x < W * 0.94 && i.x + i.w > W * 0.03));
		const body = median(ls.filter(l => l.text.length > 40).map(l => Math.round(l.h * 2) / 2)) || 10;
		const twoCols = ls.filter(l => l.text.length > 40 && l.x1 < W * 0.55).length >= 5 && ls.filter(l => l.text.length > 40 && l.x0 > W * 0.45).length >= 5;
		// Linha de texto corrido: letra do corpo, comprida, sem buracos grandes (as tabelas têm)
		// Onde começam as linhas de texto corrido (uma ou duas colunas)
		const cnt = {};
		for (const l of ls) if (l.text.length > 40) { const k = Math.round(l.x0 / 4) * 4; cnt[k] = (cnt[k] || 0) + 1; }
		const starts = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 2).filter(e => e[1] >= 3).map(e => +e[0]);
		const atStart = l => !starts.length || starts.some(x => Math.abs(l.x0 - x) < body * 2);
		const isBody = (l, cx0, cx1) => atStart(l) && Math.abs(l.h - body) <= body * 0.08 && (l.x1 - l.x0) > (cx1 - cx0) * 0.7 && l.maxGap < body * 1.6 && /[a-z]{3,}.*\s.*[a-z]{3,}/.test(l.text);
		// Linha que faz parte de uma fila de tabela: na mesma altura há um pedaço curto (célula)
		for (const o of ls) o.inRow = ls.some(p => p !== o && Math.abs(p.top - o.top) < 2 && (p.x1 < o.x0 || p.x0 > o.x1) && (p.x1 - p.x0) < W * 0.2 && p.text.length < 40);
		const out = [], blocks = [];
		const caps = ls.filter(l => CAPTION.test(l.text)).sort((a, b) => (/^\s*(t|q)/i.test(b.text) ? 1 : 0) - (/^\s*(t|q)/i.test(a.text) ? 1 : 0));
		for (const l of caps) {
			const m = l.text.match(CAPTION);
			if (!m) continue;
			// Referência no meio do texto ("Figure 3 shows…"): linha de corpo sem pontuação depois do número
			const kind = /^(t|q)/i.test(m[1]) ? "table" : "figure";
			const restStarts = m[4] ? m[4][0] : "";
			const looksRef = !m[3] && /^[a-z(]/.test(restStarts) && isBody(l, 0, W);
			if (looksRef || /^[),;]/.test(m[4] || "") || (m[3] === "." && /^[a-z(]/.test(restStarts))) continue;
			// Coluna da legenda
			let cx0 = 0, cx1 = W;
			if (twoCols && l.x1 < W * 0.56) cx1 = W * 0.52;
			else if (twoCols && l.x0 > W * 0.44) cx0 = W * 0.48;
			const inCol = o => Math.min(o.x1, cx1) - Math.max(o.x0, cx0) > Math.max(2, (o.x1 - o.x0) * 0.5);
			const prev = ls.filter(o => o !== l && inCol(o) && o.bottom <= l.top + 1).pop();
			if (prev && l.top - prev.bottom < body * 0.6 && isBody(prev, cx0, cx1) && !/[.:]\s*$/.test(prev.text) && Math.abs(l.h - body) <= body * 0.12) continue;
			const bw = cx1 - cx0; // largura da coluna: mede o texto corrido mesmo quando a região ocupa a página
			const region = (cx0, cx1) => {
				const inCol = o => Math.min(o.x1, cx1) - Math.max(o.x0, cx0) > Math.max(2, (o.x1 - o.x0) * 0.5);
				const body2 = o => !o.inRow && isBody(o, 0, bw) && (o.x1 - o.x0) > bw * 0.7;
				const others = ls.filter(o => o !== l && inCol(o));
				let capBottom = l.bottom;
				let extra = 0;
				for (const o of others) { if (o.top >= capBottom - 1 && o.top - capBottom < l.h * 0.7 && Math.abs(o.h - l.h) <= l.h * 0.04 && extra < 4 && !CAPTION.test(o.text)) { capBottom = o.bottom; extra++; } else if (o.top > capBottom) break; }
				const grow = dir => {
					let last = dir < 0 ? l.top : capBottom;
					const seq = dir < 0 ? others.filter(o => o.bottom <= l.top + 1).reverse() : others.filter(o => o.top >= capBottom - 1);
					for (let k = 0; k < seq.length; k++) {
						const o = seq[k];
						if (CAPTION.test(o.text)) break;
						if (body2(o)) {
							const next = seq[k + 1];
							if (!next || body2(next) || Math.abs(dir < 0 ? o.top - next.bottom : next.top - o.bottom) > body * 1.5) break;
						}
						last = dir < 0 ? Math.min(last, o.top) : Math.max(last, o.bottom);
					}
					for (const im of images.filter(inCol)) {
						if (dir < 0 && im.y1 <= l.top + 2 && im.y1 >= last - 6) last = Math.min(last, im.y0);
						if (dir > 0 && im.y0 >= capBottom - 2 && im.y0 <= last + 6) last = Math.max(last, im.y1);
					}
					return last;
				};
				let up = grow(-1), down = grow(1);
				if (kind === "figure") {
					// Imagens logo por cima da legenda: a figura é o grupo dessas imagens (mais os rótulos entre elas)
					let top = null, edge = l.top;
					for (const im of images.filter(inCol).sort((a, b) => b.y1 - a.y1)) {
						if (im.y0 < l.top && im.y1 <= l.top + 4 && im.y1 >= edge - 40 && !caps.some(c => c !== l && c.top >= im.y1 - 2 && c.bottom <= edge + 2 && c.x1 > cx0 && c.x0 < cx1)) { top = top === null ? im.y0 : Math.min(top, im.y0); edge = Math.min(edge, im.y0); }
					}
					if (top !== null) up = top;
					// Nunca por cima de uma tabela já encontrada
					for (const t of blocks) if (t.y1 <= l.top + 2 && t.y1 > up && t.x1 > cx0 && t.x0 < cx1) up = t.y1;
				}
				const upSize = l.top - up, downSize = down - capBottom;
				const useUp = kind === "figure" ? upSize > 20 || downSize < 20 : !(downSize > 20 || upSize < 20);
				const y0 = useUp ? up : l.top, y1 = useUp ? capBottom : down;
				if (y1 - y0 < 30) return null;
				const inside = ls.filter(o => o.top >= y0 - 1 && o.bottom <= y1 + 1 && inCol(o));
				const ims = images.filter(im => inCol(im) && im.y0 < y1 && im.y1 > y0);
				let x0 = Math.min(...inside.map(o => o.x0), ...ims.map(im => im.x0)), x1 = Math.max(...inside.map(o => o.x1), ...ims.map(im => im.x1));
				if (!isFinite(x0)) { x0 = cx0; x1 = cx1; }
				return { y0, y1, x0: Math.max(cx0, Math.min(x0, l.x0)), x1: Math.min(cx1, Math.max(x1, l.x1)), inside };
			};
			let r = region(cx0, cx1);
			// Legenda numa coluna, mas a figura ou tabela pode ocupar a página toda: se ao lado não há texto corrido, alarga
			if (twoCols && (cx0 > 0 || cx1 < W)) {
				const full = region(0, W);
				const ox0 = cx0 > 0 ? 0 : W * 0.48, ox1 = cx0 > 0 ? W * 0.52 : W;
				if (full && !ls.some(o => o.top >= full.y0 && o.bottom <= full.y1 && o.x0 >= ox0 - 2 && o.x1 <= ox1 + 2 && !o.inRow && isBody(o, ox0, ox1))
					&& (ls.some(o => o.top >= full.y0 && o.bottom <= full.y1 && ((o.x0 >= ox0 - 2 && o.x1 <= ox1 + 2) || (o.x0 < W * 0.46 && o.x1 > W * 0.54))) || images.some(im => im.y0 < full.y1 && im.y1 > full.y0 && im.x1 > ox0 + 20 && im.x0 < ox1 - 20)))
					r = full;
			}
			if (!r) continue;
			const { x0, x1, y0, y1 } = r;
			if (kind === "table") blocks.push({ x0, x1, y0, y1 });
			const label = (/^t/i.test(m[1]) ? "Table" : /^tab/i.test(m[1]) ? "Tabela" : m[1][0].toUpperCase() + m[1].slice(1).replace(/\.$/, "")) + " " + m[2];
			out.push({ kind, label: m[1].replace(/\.$/, "") + " " + m[2], caption: l.text.slice(0, 160), box: { x0: x0 - 4, y0: y0 - 4, x1: x1 + 4, y1: y1 + 4 } });
		}
		// A mesma figura citada duas vezes na página: fica a maior
		const best = {};
		for (const f of out) { const k = f.kind + f.label.toLowerCase().replace(/\D+/g, ""); const a = f.box; if (!best[k] || (a.y1 - a.y0) > (best[k].box.y1 - best[k].box.y0)) best[k] = f; }
		return Object.values(best);
	}
	root.ZIAFigures = { detect, lines, CAPTION };
})(typeof window !== "undefined" ? window : globalThis);
