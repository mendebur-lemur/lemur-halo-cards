// Küçük yardımcılar. Eski Safari (iOS 12) için ?. ve ?? kullanılmıyor.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Katı sayı çevirme: "2026-10-04T06:00" ya da "12abc" sayı sayılmaz (parseFloat bunları 2026 / 12 yapardı)
const num = (v) => {
  if (typeof v === 'number') return isFinite(v) ? v : null;
  if (typeof v !== 'string') return null;
  const s = v.trim(); if (!s) return null;
  const n = Number(s); return isFinite(n) ? n : null;
};
const round = (v, d) => { const k = Math.pow(10, d || 0); return Math.round(v * k) / k; };

// Halenin ikinci parıltısı için ana rengin açık tonu (beyaza %55 yaklaştırılmış)
const tint = (rgb) => rgb.split(',').map((v) => Math.round(+v + (255 - v) * 0.55)).join(',');

const isOff = (st) => !st || st.state === 'off' || st.state === 'unavailable' || st.state === 'unknown';
const isDead = (st) => !st || st.state === 'unavailable' || st.state === 'unknown';

// Cihazdan uzun süredir haber yoksa ya da unavailable/unknown ise true
function stale(st, limit) {
  if (isDead(st)) return true;
  const ts = Date.parse(st.last_reported || st.last_updated);
  return isFinite(ts) && limit > 0 && (Date.now() - ts) / 1000 > limit;
}

// Varlığın sayısal değeri (yoksa null)
function stateNum(hass, id) {
  if (!id || !hass.states[id]) return null;
  return num(hass.states[id].state);
}

// Güç sensörünü watt'a çevirir. Birim büyük/küçük harfe duyarlı: mW (miliwatt) ile MW (megawatt) farklı.
const POWER_UNITS = { W: 1, kW: 1000, MW: 1e6, GW: 1e9, mW: 0.001 };
function watts(hass, id) {
  if (!id || !hass.states[id]) return null;
  const st = hass.states[id], v = num(st.state);
  if (v === null) return null;
  const k = POWER_UNITS[String(st.attributes.unit_of_measurement || 'W').trim()];
  return v * (k || 1);
}

// Yüzde: Türkçede %48, İngilizcede 48%
function pct(v, lang) { return lang === 'tr' ? '%' + v : v + '%'; }

// Sıcaklık birimi: HA'nın birim sistemi (°C / °F). Konfor hesapları °C ile yapılır.
function tempUnit(hass) { return (hass && hass.config && hass.config.unit_system && hass.config.unit_system.temperature) || '°C'; }
function toC(v, unit) { return v === null || v === undefined ? v : (String(unit).indexOf('F') >= 0 ? (v - 32) * 5 / 9 : v); }
function fmtPower(w) {
  const a = Math.abs(w);
  return a >= 1000 ? round(w / 1000, a >= 10000 ? 0 : 1) + ' kW' : Math.round(w) + ' W';
}

// Sensör değeri + birimi: "24.5 °C", "%48" (en: "48%"), "812 ppm"
function fmtState(hass, id, decimals, lang) {
  const st = hass.states[id];
  if (!st) return '';
  const v = num(st.state);
  if (v === null) return st.state;
  const u = st.attributes.unit_of_measurement || '';
  const d = decimals !== undefined && decimals !== null && decimals !== '' ? Number(decimals) : (Math.abs(v) < 100 && v % 1 ? 1 : 0);
  const s = String(round(v, d));
  if (u === '%') return pct(s, lang || 'tr');
  return u ? s + ' ' + u : s;
}

function friendly(hass, id) {
  const st = hass.states[id];
  return (st && st.attributes.friendly_name) || id;
}

// HA'nın ayrıntı penceresini açar
function moreInfo(el, entityId) {
  el.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: entityId }, bubbles: true, composed: true }));
}

// Fan hızı simgeleri (klima ve hava temizleyici). Listede olmayan değer mdi:fan alır.
const FAN_ICONS = { auto: 'mdi:fan-auto', off: 'mdi:fan-off', on: 'mdi:fan',
  low: 'mdi:fan-speed-1', quiet: 'mdi:fan-speed-1', silent: 'mdi:fan-speed-1', sleep: 'mdi:fan-speed-1', medium_low: 'mdi:fan-speed-1',
  medium: 'mdi:fan-speed-2', middle: 'mdi:fan-speed-2', mid: 'mdi:fan-speed-2', medium_high: 'mdi:fan-speed-2', normal: 'mdi:fan-speed-2',
  high: 'mdi:fan-speed-3', strong: 'mdi:fan-speed-3', turbo: 'mdi:fan-speed-3', powerful: 'mdi:fan-speed-3', boost: 'mdi:fan-speed-3', max: 'mdi:fan-speed-3' };
const fanIcon = (x) => FAN_ICONS[String(x).toLowerCase()] || 'mdi:fan';
// Fan adı: bilinen değerler çevrilir, bilinmeyen değer okunur hâle getirilir
const fanLabel = (lang, x) => { const v = tMaybe(lang, 'f_' + String(x).toLowerCase()); return v !== null ? v : prettify(x); };

// İlk uygun varlık (editör ilk açıldığında örnek ayar için)
function firstEntity(hass, domains, filter) {
  if (!hass) return '';
  const ids = Object.keys(hass.states).filter((id) => domains.indexOf(id.split('.')[0]) >= 0 && (!filter || filter(hass.states[id])));
  return ids[0] || '';
}

addText({
  f_auto: 'Otomatik', f_low: 'Düşük', f_medium_low: 'Orta-düşük', f_medium: 'Orta', f_middle: 'Orta', f_mid: 'Orta', f_normal: 'Normal',
  f_medium_high: 'Orta-yüksek', f_high: 'Yüksek', f_quiet: 'Sessiz', f_silent: 'Sessiz', f_sleep: 'Uyku', f_strong: 'Güçlü',
  f_powerful: 'Güçlü', f_turbo: 'Turbo', f_boost: 'Turbo', f_max: 'En yüksek', f_on: 'Açık', f_off: 'Kapalı', f_focus: 'Odaklı', f_diffuse: 'Yayılı'
}, {
  f_auto: 'Auto', f_low: 'Low', f_medium_low: 'Medium-low', f_medium: 'Medium', f_middle: 'Medium', f_mid: 'Medium', f_normal: 'Normal',
  f_medium_high: 'Medium-high', f_high: 'High', f_quiet: 'Quiet', f_silent: 'Silent', f_sleep: 'Sleep', f_strong: 'Strong',
  f_powerful: 'Powerful', f_turbo: 'Turbo', f_boost: 'Boost', f_max: 'Max', f_on: 'On', f_off: 'Off', f_focus: 'Focus', f_diffuse: 'Diffuse'
});
