#!/usr/bin/env python3
"""src/ klasörünü HACS'ın indireceği tek dosyada birleştirir: dist/<PAKET>.js

Sıra önemli: önce çekirdek (core/), sonra kartlar (cards/). Kartların sırası "Kart ekle" listesindeki sıradır.
Paket adı değişirse sadece PACKAGE ve REPO satırlarını değiştir (hacs.json'daki filename da aynı olmalı).
"""
import json, pathlib, re

PACKAGE = "lemur-halo-cards"                         # dist dosyasının adı (HACS bunu indirir)
REPO = "https://github.com/mendebur-lemur/lemur-halo-cards"

CORE = ["i18n.js", "bands.js", "util.js", "comfort.js", "icons.js", "base.js"]
CARDS = ["climate.js", "sensor.js", "air.js", "vacuum.js", "energy.js", "security.js", "room.js", "light.js"]

root = pathlib.Path(__file__).parent
src = root / "src"
version = (root / "VERSION").read_text().strip()

css = re.sub(r"/\*.*?\*/", "", (src / "core" / "card.css").read_text(encoding="utf-8"), flags=re.S)
css = "\n".join(l.strip() for l in css.splitlines() if l.strip())

parts = [(src / "core" / f).read_text(encoding="utf-8") for f in CORE]
parts += [(src / "cards" / f).read_text(encoding="utf-8") for f in CARDS if (src / "cards" / f).exists()]
body = "\n".join(parts).replace("const CARD_VERSION = '0.0.0';", f"const CARD_VERSION = '{version}';")

out = f"""/*! Lemur Halo Cards v{version} | PolyForm-Noncommercial-1.0.0 | {REPO} */
(() => {{
if (window.__lemurCardsLoaded) return;
window.__lemurCardsLoaded = true;
const CSS = {json.dumps(css, ensure_ascii=False)};
const DOCS_URL = {json.dumps(REPO)};
{body}
console.info('%c LEMUR HALO CARDS %c v' + CARD_VERSION + ' ', 'background:#F0A93B;color:#1A1105;font-weight:700', 'background:#1E2024;color:#ECEDEF');
}})();
"""
dst = root / "dist" / f"{PACKAGE}.js"
dst.parent.mkdir(exist_ok=True)
dst.write_text(out, encoding="utf-8")
print(dst, len(out.encode()))
