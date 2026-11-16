#!/usr/bin/env bash
# Testes dentro de um Zotero REAL, sem ecra (Xvfb), com uma IA simulada (nada sai da maquina).
# Uso: ZOTERO=<pasta do Zotero> tests/zotero_real/run.sh [xpi do addon]
# O Zotero para Linux descarrega-se de https://www.zotero.org/download/ (precisa de www.zotero.org e download.zotero.org).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
ZOTERO="${ZOTERO:?indica a pasta do Zotero em ZOTERO=}"
XPI="${1:-$(ls -t "$ROOT"/dist/assistente-ia-*.xpi | head -1)}"
WORK="${ZIA_WORK:-$(mktemp -d)}"
rm -rf "$WORK/profile" "$WORK/data"
mkdir -p "$WORK/profile/extensions" "$WORK/data"
cp "$XPI" "$WORK/profile/extensions/assistente-ia@sbhg.pt.xpi"
(cd "$HERE/runner" && zip -qr "$WORK/profile/extensions/zia-realtest@sbhg.pt.xpi" .)
cat > "$WORK/profile/user.js" <<P
user_pref("xpinstall.signatures.required", false);
user_pref("extensions.autoDisableScopes", 0);
user_pref("extensions.enabledScopes", 15);
user_pref("extensions.zotero.dataDir", "$WORK/data");
user_pref("extensions.zotero.useDataDir", true);
user_pref("extensions.zotero.firstRun2", false);
user_pref("extensions.zotero.firstRunGuidance", false);
user_pref("extensions.zotero.sync.autoSync", false);
user_pref("app.update.enabled", false);
user_pref("browser.shell.checkDefaultBrowser", false);
P
export ZIA_TEST_OUT="$WORK/results.json" ZIA_TEST_PDFS="$ROOT/tests/harness"
rm -f "$ZIA_TEST_OUT"
echo "Zotero: $ZOTERO  addon: $(basename "$XPI")  pasta: $WORK"
timeout "${ZIA_TIMEOUT:-300}" xvfb-run -a -s "-screen 0 1600x1000x24" "$ZOTERO/zotero" -profile "$WORK/profile" -no-remote -ZoteroDebugText > "$WORK/zotero.log" 2>&1 || true
if [ ! -f "$ZIA_TEST_OUT" ]; then
	echo "O Zotero nao escreveu resultados. Ultimas linhas do registo:"
	grep -iE "ZIA-TEST|error|exception" "$WORK/zotero.log" | tail -30
	exit 2
fi
node -e '
const r = require(process.argv[1]);
console.log("Zotero " + r.zotero);
let bad = 0;
for (const t of r.results) { if (!t.ok) bad++; console.log((t.ok ? "OK " : "FALHOU ") + t.name + (t.detail ? "  ·  " + t.detail : "")); }
console.log(bad ? `\n${bad} teste(s) falharam.` : "\nTodos os testes no Zotero real passaram.");
process.exit(bad ? 1 : 0);
' "$ZIA_TEST_OUT"
