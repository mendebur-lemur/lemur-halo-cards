// Kendi simgelerimiz. Petek simgeleri Hakan'ın petek-ikonlari.js çiziminden (dev/eski-kartlar/).
// MDI simgeleri için HA'nın ha-icon bileşeni kullanılır (ek bağımlılık değil).
const ICONS = (() => {
  const f = (n) => Math.round(n * 100) / 100;
  const rr = (x, y, w, h, r) => {
    r = Math.min(r, w / 2, h / 2);
    return 'M' + f(x + r) + ' ' + f(y) + 'H' + f(x + w - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + w) + ' ' + f(y + r) +
      'V' + f(y + h - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + w - r) + ' ' + f(y + h) +
      'H' + f(x + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x) + ' ' + f(y + h - r) +
      'V' + f(y + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + r) + ' ' + f(y) + 'Z';
  };
  const rrHole = (x, y, w, h, r) => {
    r = Math.min(r, w / 2, h / 2);
    return 'M' + f(x + r) + ' ' + f(y) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x) + ' ' + f(y + r) +
      'V' + f(y + h - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x + r) + ' ' + f(y + h) +
      'H' + f(x + w - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x + w) + ' ' + f(y + h - r) +
      'V' + f(y + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x + w - r) + ' ' + f(y) + 'Z';
  };
  const circle = (cx, cy, r) =>
    'M' + f(cx - r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 1 ' + f(cx + r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 1 ' + f(cx - r) + ' ' + f(cy) + 'Z';
  const circleHole = (cx, cy, r) =>
    'M' + f(cx - r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(cx + r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(cx - r) + ' ' + f(cy) + 'Z';
  const sectional = (bx, by, s) => {
    const R = (x, y, w, h, r) => rr(bx + x * s, by + y * s, w * s, h * s, r * s);
    let p = R(0, 3, 20, 1.7, 0.85) + R(0, 11.3, 20, 1.7, 0.85);
    for (let i = 0; i < 4; i++) p += R(1.4 + i * 4.55, 0.5, 3.3, 14.5, 1.65);
    return p + R(2.05, 15, 2, 2, 0.6) + R(15.95, 15, 2, 2, 0.6);
  };
  const panel = (bx, by, s) => {
    const R = (x, y, w, h, r) => rr(bx + x * s, by + y * s, w * s, h * s, r * s);
    const H = (x, y, w, h, r) => rrHole(bx + x * s, by + y * s, w * s, h * s, r * s);
    let p = R(1, 0.5, 18, 14, 1.8);
    for (let i = 0; i < 6; i++) p += H(3.3 + i * 2.55, 2.6, 0.95, 9.8, 0.47);
    return p + R(0, 1.6, 1.4, 1.6, 0.4) + R(18.6, 11.8, 1.4, 1.6, 0.4) + R(3, 14.5, 1.8, 2.5, 0.5) + R(15.2, 14.5, 1.8, 2.5, 0.5);
  };
  const slash = (x1, y1, x2, y2, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const nx = (-dy / L) * w / 2, ny = (dx / L) * w / 2;
    return 'M' + f(x1 - nx) + ' ' + f(y1 - ny) + 'L' + f(x2 - nx) + ' ' + f(y2 - ny) + 'L' + f(x2 + nx) + ' ' + f(y2 + ny) + 'L' + f(x1 + nx) + ' ' + f(y1 + ny) + 'Z';
  };
  const badge = (cx, cy, r) => circle(cx, cy, r) + rrHole(cx - r * 0.17, cy - r * 0.62, r * 0.34, r * 0.72, r * 0.17) + circleHole(cx, cy + r * 0.5, r * 0.19);
  const full = { bx: 2, by: 3.5, s: 1 };
  const small = { bx: 1.5, by: 8.6, s: 0.72 };
  return {
    'sectional': sectional(full.bx, full.by, full.s),
    'sectional-off': sectional(full.bx, full.by, full.s) + slash(3, 2.5, 21, 21.5, 2.2),
    'sectional-lost': sectional(small.bx, small.by, small.s) + badge(18.6, 5.6, 4.6),
    'panel': panel(full.bx, full.by, full.s),
    'panel-off': panel(full.bx, full.by, full.s) + slash(3, 2.5, 21, 21.5, 2.2),
    'panel-lost': panel(small.bx, small.by, small.s) + badge(18.6, 5.6, 4.6)
  };
})();

function svgIcon(name) {
  const p = ICONS[name] || ICONS.panel;
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="nonzero" d="' + p + '"/></svg>';
}
