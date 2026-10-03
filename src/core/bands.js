// Hale renkleri ve bir nefesin süresi (sn). Serin renkler yavaş, sıcak renkler hızlı nefes alır; alarm hızlı yanıp söner.
// Saf veri ve hesap, DOM yok (node testleri de bunu kullanır).
const BANDS = {
  ice:    { name: 'ice',    rgb: '120,215,255', duration: 5.2 },
  blue:   { name: 'blue',   rgb: '0,140,255',   duration: 5.0 },
  green:  { name: 'green',  rgb: '40,190,100',  duration: 4.4 },
  yellow: { name: 'yellow', rgb: '255,205,40',  duration: 4.0 },
  orange: { name: 'orange', rgb: '255,140,30',  duration: 3.8 },
  red:    { name: 'red',    rgb: '255,55,55',   duration: 3.6 },
  purple: { name: 'purple', rgb: '160,100,255', duration: 4.6 },
  grey:   { name: 'grey',   rgb: '150,150,150', duration: 6.0 },
  alarm:  { name: 'alarm',  rgb: '255,55,55',   duration: 1.2 }
};
const BAND_NAMES = ['ice', 'blue', 'green', 'yellow', 'orange', 'red', 'alarm', 'purple', 'grey'];

function band(name) { return BANDS[name] || BANDS.green; }

// Home Assistant renk seçicisinin adları (temadan okunamazsa bu değerler kullanılır)
const UI_COLORS = { primary: '3,169,244', accent: '255,152,0', pink: '233,30,99', purple: '146,107,199', 'deep-purple': '110,65,171',
  indigo: '63,81,181', 'light-blue': '3,169,244', cyan: '0,188,212', teal: '0,150,136', 'light-green': '139,195,74', lime: '205,220,57',
  amber: '255,193,7', 'deep-orange': '255,111,34', brown: '121,85,72', 'light-grey': '189,189,189', 'dark-grey': '96,96,96',
  'blue-grey': '96,125,139', black: '0,0,0', white: '255,255,255' };

// Kullanıcının yazdığı rengi "r,g,b" yapar: [r,g,b], "#rgb", "#rrggbb", "r,g,b" ya da renk adı (green, red...). Anlaşılmazsa null.
function parseColor(v) {
  if (v === null || v === undefined || v === '') return null;
  const ok = (a) => a.length === 3 && a.every((x) => isFinite(x) && x >= 0 && x <= 255);
  if (Array.isArray(v)) { const a = v.map(Number); return ok(a) ? a.map(Math.round).join(',') : null; }
  const s = String(v).trim().toLowerCase();
  if (BANDS[s]) return BANDS[s].rgb;
  if (UI_COLORS[s]) return UI_COLORS[s];
  let m = /^#?([0-9a-f]{6})$/.exec(s);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].substr(i, 2), 16)).join(',');
  m = /^#?([0-9a-f]{3})$/.exec(s);
  if (m) return [0, 1, 2].map((i) => parseInt(m[1][i] + m[1][i], 16)).join(',');
  const a = s.split(',').map((x) => Number(x.trim()));
  return a.length === 3 && ok(a) ? a.join(',') : null;
}
// "r,g,b" → "#rrggbb" (editördeki renk seçici için)
function rgbHex(rgb) { return '#' + String(rgb).split(',').map((x) => ('0' + Number(x).toString(16)).slice(-2)).join(''); }

// Hale hareketleri. auto: kartın kendi seçimi (normalde yavaş nefes, alarm durumunda yanıp söner)
const EFFECTS = ['auto', 'breathe', 'pulse', 'blink', 'still', 'none'];

// Konfor bandından durum anahtarı (renk ve hale ayarlarında kullanılır)
const BAND_TONE = { ice: 'very_cold', blue: 'cold', green: 'comfort', yellow: 'warm', orange: 'warm', red: 'hot', alarm: 'lost' };

// Değeri dört sınırla beş bölgeye ayırır: < s1 → r1, < s2 → r2, < s3 → r3, < s4 → r4, üstü → r5.
// Boş (null) sınır atlanır, o bölge bir sonrakiyle birleşir. Dönen değer renk adıdır.
function zoneColor(value, limits, colors) {
  for (let i = 0; i < 4; i++) {
    const l = limits[i];
    if (l !== null && l !== undefined && l !== '' && isFinite(l) && value < Number(l)) return colors[i];
  }
  return colors[4];
}

// Aynı bölgelemeyle sıra numarası (0-4): etiket seçmek için
function zoneIndex(value, limits) {
  for (let i = 0; i < 4; i++) {
    const l = limits[i];
    if (l !== null && l !== undefined && l !== '' && isFinite(l) && value < Number(l)) return i;
  }
  return 4;
}
