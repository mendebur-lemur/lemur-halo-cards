// Saf hesaplar (DOM yok). Bugünkü Jinja şablonlarının birebir JS karşılığı.
// Kaynak: dev/eski-kartlar/klima-karti.md ve petek-karti.md

const COMFORT_DEFAULTS = { cold: 16, cool: 19, warm: 29, hot: 31.5, humid_dewpoint: 18, dry_humidity: 28 };
const RADIATOR_DEFAULTS = { very_cold: 15, cold: 18, comfort: 24, warm: 26, outdoor_base: 10, outdoor_factor: 0.33, outdoor_max_shift: 3 };

// Renk ve nefes süresi (sn). Süre CSS'te 1.15 ile çarpılır (bugünkü kartla aynı).
const BANDS = {
  ice:    { rgb: '120,215,255', anim: 'blue',   duration: 4.4 },
  blue:   { rgb: '0,140,255',   anim: 'blue',   duration: 4.2 },
  green:  { rgb: '40,190,100',  anim: 'green',  duration: 3.8 },
  yellow: { rgb: '255,205,40',  anim: 'yellow', duration: 3.6 },
  red:    { rgb: '255,55,55',   anim: 'red',    duration: 3.4 },
  alarm:  { rgb: '255,55,55',   anim: 'red',    duration: 1.2 }
};

// Çiy noktası (Magnus formülü). Nem yoksa null.
function dewPoint(t, rh) {
  if (!(rh > 0) || !isFinite(t)) return null;
  const g = Math.log(rh / 100) + (17.62 * t) / (243.12 + t);
  return (243.12 * g) / (17.62 - g);
}

// Hissedilen sıcaklık: 13.5 °C üstü çiy noktası sıcağı artırır, 12 °C altı kuru hava serinletir;
// etki 21 °C altında devreye girmez, 24 °C'de tam etkili olur.
function feelsLike(t, rh) {
  const td = dewPoint(t, rh);
  if (td === null) return { his: t, td: null };
  const nemli = Math.max(0, td - 13.5);
  const kuru = Math.max(0, 12 - td);
  const k = Math.min(1, Math.max(0, (t - 21) / 3));
  return { his: t + k * (0.55 * nemli - 0.3 * kuru), td: td };
}

// Konfor etiketi anahtarı (i18n.js'deki anahtarlar)
function comfortKey(t, rh, c) {
  c = Object.assign({}, COMFORT_DEFAULTS, c || {});
  const r = feelsLike(t, rh);
  const his = r.his, td = r.td;
  if (his < c.cold) return 'very_cold';
  if (his < c.cool) return 'cool';
  if (his < c.warm) {
    if (td !== null && td >= c.humid_dewpoint) return 'humid';
    if (rh > 0 && rh < c.dry_humidity) return 'dry';
    return 'comfortable';
  }
  if (his < c.hot) return 'warm';
  return 'hot';
}

// Klima hale bandı: hissedilen sıcaklığa göre
function acBand(t, rh, c) {
  c = Object.assign({}, COMFORT_DEFAULTS, c || {});
  const his = feelsLike(t, rh).his;
  if (his < c.cool) return BANDS.blue;
  if (his < c.warm) return BANDS.green;
  if (his < c.hot) return BANDS.yellow;
  return BANDS.red;
}

// Petek hale bandı: gerçek sıcaklığa göre, dış sıcaklıkla kayan eşikler
function radiatorBand(t, outdoor, b, lost) {
  if (lost) return BANDS.alarm;
  b = Object.assign({}, RADIATOR_DEFAULTS, b || {});
  let kay = 0;
  if (outdoor !== null && outdoor !== undefined && isFinite(outdoor)) {
    kay = Math.max(0, Math.min(b.outdoor_max_shift, (outdoor - b.outdoor_base) * b.outdoor_factor));
  }
  if (t < b.very_cold + kay) return BANDS.ice;
  if (t < b.cold + kay) return BANDS.blue;
  if (t < b.comfort + kay) return BANDS.green;
  if (t < b.warm + kay) return BANDS.yellow;
  return BANDS.red;
}

if (typeof module !== 'undefined') {
  module.exports = { COMFORT_DEFAULTS, RADIATOR_DEFAULTS, BANDS, dewPoint, feelsLike, comfortKey, acBand, radiatorBand };
}
