#!/usr/bin/env python3
"""src/ klasörünü HACS'ın indireceği tek dosyada birleştirir: dist/lemur-climate-card.js"""
import json, pathlib, re
root = pathlib.Path(__file__).parent
src = root / "src"
version = (root / "VERSION").read_text().strip()
css = re.sub(r"/\*.*?\*/", "", (src / "card.css").read_text(encoding="utf-8"), flags=re.S)
css = "\n".join(l.strip() for l in css.splitlines() if l.strip())
parts = [(src / f).read_text(encoding="utf-8") for f in ("i18n.js", "comfort.js", "icons.js", "card.js", "editor.js")]
body = "\n".join(parts).replace("const CARD_VERSION = '0.0.0';", f"const CARD_VERSION = '{version}';")
out = f"""/*! Lemur Climate Card v{version} | MIT */
(() => {{
if (customElements.get('lemur-climate-card')) return;
const module = undefined;
const CSS = {json.dumps(css, ensure_ascii=False)};
{body}
customElements.define('lemur-climate-card', LemurClimateCard);
customElements.define('lemur-climate-card-editor', LemurClimateCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'lemur-climate-card')) {{
  window.customCards.push({{ type: 'lemur-climate-card', preview: true,
    documentationURL: 'https://github.com/mendebur-lemur/lemur-climate-card',
    get name() {{ return pickLang(document.querySelector('home-assistant') && document.querySelector('home-assistant').hass) === 'tr' ? 'Lemur İklim Kartı' : 'Lemur Climate Card'; }},
    get description() {{ return pickLang(document.querySelector('home-assistant') && document.querySelector('home-assistant').hass) === 'tr' ? 'Klima ve petek için konfor göstergeli kart' : 'Air conditioner and radiator card with comfort display'; }} }});
}}
console.info('%c LEMUR CLIMATE CARD %c v' + CARD_VERSION + ' ', 'background:#F0A93B;color:#1A1105;font-weight:700', 'background:#1E2024;color:#ECEDEF');
}})();
"""
dst = root / "dist" / "lemur-climate-card.js"
dst.parent.mkdir(exist_ok=True)
dst.write_text(out, encoding="utf-8")
print(dst, len(out.encode()))
