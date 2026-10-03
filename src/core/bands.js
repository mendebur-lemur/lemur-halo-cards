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
