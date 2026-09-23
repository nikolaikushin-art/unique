import type { StudioBody, StudioVehicle } from "./studio-vehicles";

/**
 * Studio-render generator.
 * Produces 24 category-consistent views for each vehicle:
 *   0-5   Экстерьер   (6 exterior framings)
 *   6-11  Интерьер    (6 interior viewpoints)
 *   12-17 Деталь      (6 close-up details)
 *   18-23 Мастерство  (6 craftsmanship / process shots)
 *
 * Every view keeps identical paint, wheels, interior, brand and the neutral
 * UNIQUE studio background. Brand wordmark is stamped on the bonnet / tailgate
 * where a real manufacturer badge would appear. No UNIQUE branding is baked
 * into the backdrop; the UNIQUE plate appears only on the vehicle's number
 * plate. The final detail view (17) intentionally carries NO text overlay,
 * so any historical "logo watermark" on 06/06 is gone.
 */

const encode = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)}`;

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CATEGORY_LABEL: Record<number, string> = {
  0: "ЭКСТЕРЬЕР · 3/4 СПЕРЕДИ",
  1: "ЭКСТЕРЬЕР · СТРОГО СПЕРЕДИ",
  2: "ЭКСТЕРЬЕР · СТРОГО СЗАДИ",
  3: "ЭКСТЕРЬЕР · ЛЕВЫЙ БОРТ",
  4: "ЭКСТЕРЬЕР · ПРАВЫЙ БОРТ",
  5: "ЭКСТЕРЬЕР · 3/4 СЗАДИ",
  6: "ИНТЕРЬЕР · КОКПИТ",
  7: "ИНТЕРЬЕР · РУЛЬ И ПРИБОРЫ",
  8: "ИНТЕРЬЕР · ЦЕНТРАЛЬНАЯ КОНСОЛЬ",
  9: "ИНТЕРЬЕР · ЗАДНИЙ РЯД",
  10: "ИНТЕРЬЕР · ПОРОГ И ДВЕРЬ",
  11: "ИНТЕРЬЕР · ПОТОЛОК",
  12: "ДЕТАЛЬ · КОЛЕСО",
  13: "ДЕТАЛЬ · ФАРА",
  14: "ДЕТАЛЬ · ЗАДНИЙ ФОНАРЬ",
  15: "ДЕТАЛЬ · РЕШЁТКА",
  16: "ДЕТАЛЬ · ЭМБЛЕМА",
  17: "ДЕТАЛЬ · ПОВЕРХНОСТЬ ЛАКА",
  18: "МАСТЕРСТВО · РАСКРОЙ ПЛЁНКИ",
  19: "МАСТЕРСТВО · НАНЕСЕНИЕ",
  20: "МАСТЕРСТВО · ПОЛИРОВКА",
  21: "МАСТЕРСТВО · ЗАМЕР ТОЛЩИНОМЕРОМ",
  22: "МАСТЕРСТВО · ПРИЁМКА",
  23: "МАСТЕРСТВО · ФИНАЛЬНАЯ ПРИЁМКА",
};

const bodyGeometry: Record<
  StudioBody,
  { roof: string; body: string; height: number; clearance: number; wheel: number }
> = {
  coupe: {
    roof: "M610 470 C705 330 930 318 1052 466 L1010 505 C890 462 742 460 610 470",
    body: "M282 652 C380 514 527 452 728 446 L1010 452 C1164 457 1314 525 1423 646 L1376 770 L330 772 Z",
    height: 1,
    clearance: 0,
    wheel: 104,
  },
  convertible: {
    roof: "M650 490 C772 404 946 407 1044 500 L1008 528 C902 492 762 489 650 490",
    body: "M284 650 C396 530 554 475 746 472 L1022 478 C1166 484 1314 536 1424 648 L1374 770 L330 772 Z",
    height: 1,
    clearance: 0,
    wheel: 104,
  },
  sedan: {
    roof: "M550 482 C668 324 984 322 1112 484 L1078 525 C925 476 718 473 550 482",
    body: "M250 642 C378 525 530 462 726 450 L1110 466 C1260 480 1392 548 1460 648 L1418 776 L304 776 Z",
    height: 1.08,
    clearance: 0,
    wheel: 98,
  },
  suv: {
    roof: "M498 502 C560 328 1018 302 1194 504 L1162 548 C960 504 708 492 498 502",
    body: "M218 626 C318 474 468 400 710 390 L1148 414 C1330 430 1462 526 1510 648 L1450 792 L284 794 Z",
    height: 1.2,
    clearance: 24,
    wheel: 116,
  },
  wagon: {
    roof: "M512 490 C610 340 1050 342 1236 520 L1192 554 C972 498 726 486 512 490",
    body: "M246 638 C364 510 512 452 738 446 L1170 462 C1328 476 1432 544 1480 650 L1426 776 L302 776 Z",
    height: 1.08,
    clearance: 4,
    wheel: 100,
  },
  supercar: {
    roof: "M680 505 C754 388 950 376 1046 505 L1006 536 C905 500 788 498 680 505",
    body: "M260 660 C408 540 580 494 786 484 L1054 488 C1224 496 1378 554 1464 662 L1402 762 L310 762 Z",
    height: 0.86,
    clearance: -5,
    wheel: 106,
  },
  hypercar: {
    roof: "M690 506 C760 386 960 366 1060 506 L1016 536 C912 496 786 496 690 506",
    body: "M240 664 C394 538 558 498 792 492 L1082 496 C1268 500 1408 558 1482 666 L1400 762 L300 762 Z",
    height: 0.84,
    clearance: -8,
    wheel: 108,
  },
};

function studioDefs(v: StudioVehicle) {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#111316"/>
        <stop offset="0.44" stop-color="#07080a"/>
        <stop offset="1" stop-color="#17191c"/>
      </linearGradient>
      <radialGradient id="floor" cx="50%" cy="74%" r="60%">
        <stop offset="0" stop-color="#5a5f66" stop-opacity="0.82"/>
        <stop offset="0.42" stop-color="#25282d" stop-opacity="0.72"/>
        <stop offset="1" stop-color="#050607" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="spot" cx="50%" cy="44%" r="48%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
        <stop offset="0.52" stop-color="#ffffff" stop-opacity="0.07"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="paint" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/>
        <stop offset="0.18" stop-color="${v.paint}"/>
        <stop offset="0.72" stop-color="${v.paint}"/>
        <stop offset="1" stop-color="#020203" stop-opacity="0.68"/>
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#dbe5ea" stop-opacity="0.34"/>
        <stop offset="1" stop-color="#020304" stop-opacity="0.86"/>
      </linearGradient>
      <linearGradient id="plate" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f7f5ef"/>
        <stop offset="1" stop-color="#c9c6bd"/>
      </linearGradient>
      <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f4f4f5"/>
        <stop offset="0.5" stop-color="#8b8f95"/>
        <stop offset="1" stop-color="#f4f4f5"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-30%" width="140%" height="170%"><feDropShadow dx="0" dy="34" stdDeviation="28" flood-color="#000" flood-opacity="0.78"/></filter>
      <filter id="glow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
}

const studioBackground = (v: StudioVehicle, view: number) => `
  <rect width="1800" height="1125" fill="url(#bg)"/>
  <rect width="1800" height="1125" fill="url(#spot)"/>
  <rect y="735" width="1800" height="390" fill="url(#floor)"/>
  <path d="M0 768 H1800" stroke="#eae8e2" stroke-opacity="0.08"/>
  <path d="M260 190 H1540" stroke="#eae8e2" stroke-opacity="0.08"/>
  <path d="M260 190 L120 768" stroke="#eae8e2" stroke-opacity="0.05"/>
  <path d="M1540 190 L1680 768" stroke="#eae8e2" stroke-opacity="0.05"/>
  <circle cx="900" cy="210" r="380" fill="#ffffff" opacity="0.04"/>
  <text x="100" y="132" fill="#eae8e2" opacity="0.24" font-family="Jost, Arial" font-size="16" letter-spacing="9">SET ${String(view + 1).padStart(2, "0")} / 24 · ${esc(v.paintName.toUpperCase())}</text>
`;

/** Number plate stamped with UNIQUE mark — appears only on the plate. */
const plateLogo = (x: number, y: number, width = 170, height = 42) => `
  <g>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="7" fill="url(#plate)" stroke="#111" stroke-opacity="0.5"/>
    <text x="${x + width / 2}" y="${y + 24}" text-anchor="middle" fill="#09090a" font-family="Arial Rounded MT Bold, Jost, Arial" font-weight="700" font-size="19" letter-spacing="2.6">UNIQUE</text>
    <text x="${x + width / 2}" y="${y + 35}" text-anchor="middle" fill="#09090a" font-family="Jost, Arial" font-weight="700" font-size="6" letter-spacing="4.4">DETAILING</text>
    <path d="M${x + 18} ${y + 31} H${x + 48} M${x + width - 48} ${y + 31} H${x + width - 18}" stroke="#e23a46" stroke-width="5" stroke-linecap="round"/>
  </g>`;

/** Manufacturer wordmark stamped where the real bonnet/tailgate badge sits. */
const brandBadge = (v: StudioVehicle, x: number, y: number, size = 22) => {
  const text = v.brand.toUpperCase();
  const w = Math.max(160, text.length * size * 0.6);
  return `
    <g opacity="0.95">
      <rect x="${x - w / 2}" y="${y - size * 0.9}" width="${w}" height="${size * 1.5}" rx="${size * 0.4}" fill="#0b0c0d" stroke="url(#chrome)" stroke-width="1.5" opacity="0.55"/>
      <text x="${x}" y="${y + size * 0.35}" text-anchor="middle" fill="url(#chrome)" font-family="Jost, Arial" font-weight="700" font-size="${size}" letter-spacing="${size * 0.18}">${esc(text)}</text>
    </g>`;
};

const wheel = (cx: number, cy: number, r: number, v: StudioVehicle) => `
  <g>
    <circle cx="${cx}" cy="${cy}" r="${r + 26}" fill="#020203" opacity="0.45"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#050607"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="${v.wheel}" stroke="#64676b" stroke-opacity="0.55" stroke-width="6"/>
    ${Array.from({ length: 10 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 10;
      const x2 = cx + Math.cos(a) * r * 0.58;
      const y2 = cy + Math.sin(a) * r * 0.58;
      return `<path d="M${cx} ${cy} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#b8bbc0" stroke-opacity="0.55" stroke-width="7" stroke-linecap="round"/>`;
    }).join("")}
    <circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="#d6d7d8"/>
  </g>`;

/* ─────────── EXTERIOR VIEWS ─────────── */

const extFrontThreeQuarter = (v: StudioVehicle) => {
  const g = bodyGeometry[v.body];
  return `<g filter="url(#shadow)" transform="translate(0 ${g.clearance}) scale(1 ${g.height})">
    <path d="${g.body}" fill="url(#paint)" stroke="#f5f2ea" stroke-opacity="0.18" stroke-width="3"/>
    <path d="${g.roof}" fill="url(#glass)" stroke="#f4f4f4" stroke-opacity="0.16" stroke-width="3"/>
    <path d="M304 648 C400 610 510 608 610 632" stroke="#fff3d7" stroke-opacity="0.72" stroke-width="18" stroke-linecap="round" filter="url(#glow)"/>
    <path d="M1248 650 C1326 620 1390 624 1448 662" stroke="#fff3d7" stroke-opacity="0.6" stroke-width="16" stroke-linecap="round" filter="url(#glow)"/>
    ${brandBadge(v, 900, 555)}
    ${plateLogo(815, 656)}
    ${wheel(520, 762, g.wheel, v)}${wheel(1250, 762, g.wheel, v)}
  </g>`;
};

const extFrontStrict = (v: StudioVehicle) => {
  const isSuv = v.body === "suv" || v.body === "wagon";
  const top = isSuv ? 322 : 382;
  const width = isSuv ? 830 : 760;
  const x = 900 - width / 2;
  return `<g filter="url(#shadow)">
    <path d="M${x + 130} ${top + 120} C${x + 180} ${top - 30} ${x + width - 180} ${top - 30} ${x + width - 130} ${top + 120} L${x + width - 70} ${top + 330} C${x + width - 155} ${top + 390} ${x + 155} ${top + 390} ${x + 70} ${top + 330} Z" fill="url(#paint)" stroke="#f5f2ea" stroke-opacity="0.18" stroke-width="3"/>
    <path d="M${x + 225} ${top + 92} C${x + 300} ${top + 2} ${x + width - 300} ${top + 2} ${x + width - 225} ${top + 92} L${x + width - 260} ${top + 154} C${x + width - 350} ${top + 120} ${x + 350} ${top + 120} ${x + 260} ${top + 154} Z" fill="url(#glass)"/>
    <path d="M${x + 110} ${top + 245} C${x + 210} ${top + 205} ${x + 300} ${top + 205} ${x + 385} ${top + 248}" stroke="#fff3d7" stroke-opacity="0.85" stroke-width="20" stroke-linecap="round" filter="url(#glow)"/>
    <path d="M${x + width - 385} ${top + 248} C${x + width - 300} ${top + 205} ${x + width - 210} ${top + 205} ${x + width - 110} ${top + 245}" stroke="#fff3d7" stroke-opacity="0.85" stroke-width="20" stroke-linecap="round" filter="url(#glow)"/>
    ${brandBadge(v, 900, top + 200)}
    ${plateLogo(815, top + 270)}
    ${wheel(x + 148, top + 376, 78, v)}${wheel(x + width - 148, top + 376, 78, v)}
  </g>`;
};

const extRearStrict = (v: StudioVehicle) => {
  const isSuv = v.body === "suv" || v.body === "wagon";
  const top = isSuv ? 322 : 382;
  const width = isSuv ? 830 : 760;
  const x = 900 - width / 2;
  return `<g filter="url(#shadow)">
    <path d="M${x + 130} ${top + 120} C${x + 180} ${top - 30} ${x + width - 180} ${top - 30} ${x + width - 130} ${top + 120} L${x + width - 70} ${top + 330} C${x + width - 155} ${top + 390} ${x + 155} ${top + 390} ${x + 70} ${top + 330} Z" fill="url(#paint)" stroke="#f5f2ea" stroke-opacity="0.18" stroke-width="3"/>
    <path d="M${x + 225} ${top + 92} C${x + 300} ${top + 2} ${x + width - 300} ${top + 2} ${x + width - 225} ${top + 92} L${x + width - 260} ${top + 154} C${x + width - 350} ${top + 120} ${x + 350} ${top + 120} ${x + 260} ${top + 154} Z" fill="url(#glass)"/>
    <rect x="${x + 110}" y="${top + 232}" width="290" height="32" rx="10" fill="#e23a46" opacity="0.85" filter="url(#glow)"/>
    <rect x="${x + width - 400}" y="${top + 232}" width="290" height="32" rx="10" fill="#e23a46" opacity="0.85" filter="url(#glow)"/>
    ${brandBadge(v, 900, top + 200)}
    ${plateLogo(815, top + 290)}
    ${wheel(x + 148, top + 376, 78, v)}${wheel(x + width - 148, top + 376, 78, v)}
  </g>`;
};

const extSide = (v: StudioVehicle, reverse = false) => {
  const g = bodyGeometry[v.body];
  const t = reverse ? "translate(1800 0) scale(-1 1)" : "";
  return `<g transform="${t}"><g filter="url(#shadow)" transform="translate(0 ${g.clearance}) scale(1 ${g.height})">
    <path d="M258 650 C374 506 536 450 766 444 L1134 452 C1296 462 1430 536 1510 654 L1450 772 L322 774 Z" fill="url(#paint)" stroke="#f5f2ea" stroke-opacity="0.16" stroke-width="3"/>
    <path d="M540 506 C670 330 1040 336 1194 516 L1118 544 C956 505 736 496 540 506" fill="url(#glass)" stroke="#f4f4f4" stroke-opacity="0.17" stroke-width="3"/>
    <path d="M820 502 L812 716 M1030 512 L1042 712" stroke="#020203" stroke-opacity="0.32" stroke-width="5"/>
    <path d="M392 612 C624 570 1062 562 1372 632" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="8" stroke-linecap="round"/>
    ${plateLogo(810, 685, 150, 38)}
    ${wheel(510, 762, g.wheel, v)}${wheel(1260, 762, g.wheel, v)}
  </g></g>`;
};

const extRearThreeQuarter = (v: StudioVehicle) => {
  const g = bodyGeometry[v.body];
  return `<g transform="translate(1800 0) scale(-1 1)"><g filter="url(#shadow)" transform="translate(0 ${g.clearance}) scale(1 ${g.height})">
    <path d="${g.body}" fill="url(#paint)" stroke="#f5f2ea" stroke-opacity="0.18" stroke-width="3"/>
    <path d="${g.roof}" fill="url(#glass)" stroke="#f4f4f4" stroke-opacity="0.16" stroke-width="3"/>
    <path d="M320 660 C450 620 560 620 660 640" stroke="#e23a46" stroke-opacity="0.75" stroke-width="18" stroke-linecap="round" filter="url(#glow)"/>
    <path d="M1240 640 C1340 620 1400 624 1460 656" stroke="#e23a46" stroke-opacity="0.65" stroke-width="16" stroke-linecap="round" filter="url(#glow)"/>
    ${wheel(520, 762, g.wheel, v)}${wheel(1250, 762, g.wheel, v)}
  </g></g>
  <g transform="translate(0 24)">${brandBadge(v, 900, 620)}</g>`;
};

/* ─────────── INTERIOR VIEWS ─────────── */

const intCockpit = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M390 358 H1410 C1480 358 1538 416 1538 486 V770 C1538 830 1490 878 1430 878 H370 C310 878 262 830 262 770 V486 C262 416 320 358 390 358 Z" fill="#111315" stroke="#eae8e2" stroke-opacity="0.12"/>
    <path d="M346 438 H1454 V790 H346 Z" fill="#050607"/>
    <path d="M452 510 C500 432 636 410 700 496 V802 H420 V626 C420 580 432 540 452 510 Z" fill="${v.interior}" stroke="#d6c8b8" stroke-opacity="0.18" stroke-width="4"/>
    <path d="M1100 496 C1168 410 1300 432 1348 510 C1368 540 1380 580 1380 626 V802 H1100 Z" fill="${v.interior}" stroke="#d6c8b8" stroke-opacity="0.18" stroke-width="4"/>
    <path d="M710 560 H1090 C1134 560 1170 596 1170 640 V804 H630 V640 C630 596 666 560 710 560 Z" fill="#1a1d20" stroke="#eae8e2" stroke-opacity="0.08"/>
    <circle cx="892" cy="630" r="94" fill="#0b0c0d" stroke="#c8c8c8" stroke-opacity="0.42" stroke-width="12"/>
    <path d="M792 728 H1002" stroke="#c8c8c8" stroke-opacity="0.35" stroke-width="12" stroke-linecap="round"/>
  </g>`;

const intWheelCluster = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <circle cx="900" cy="590" r="330" fill="#0b0c0d"/>
    <circle cx="900" cy="590" r="248" fill="none" stroke="${v.interior}" stroke-width="30"/>
    <rect x="700" y="360" width="400" height="180" rx="18" fill="#050607" stroke="#c8c8c8" stroke-opacity="0.32" stroke-width="4"/>
    <text x="900" y="440" text-anchor="middle" fill="#eae8e2" opacity="0.5" font-family="Jost, Arial" font-size="26" letter-spacing="8">${esc(v.brand.toUpperCase())}</text>
    <text x="900" y="482" text-anchor="middle" fill="#eae8e2" opacity="0.34" font-family="Jost, Arial" font-size="18" letter-spacing="5">${esc(v.model.toUpperCase())}</text>
    <path d="M775 590 A125 125 0 0 1 1025 590" stroke="#e23a46" stroke-width="10" fill="none" opacity="0.7"/>
    <circle cx="900" cy="590" r="34" fill="url(#chrome)"/>
    <path d="M675 812 H1125" stroke="#c8c8c8" stroke-opacity="0.32" stroke-width="8" stroke-linecap="round"/>
  </g>`;

const intConsole = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M340 320 H1460 V860 H340 Z" fill="${v.interior}" opacity="0.35"/>
    <rect x="480" y="360" width="840" height="290" rx="14" fill="#050607" stroke="#c8c8c8" stroke-opacity="0.3" stroke-width="4"/>
    <rect x="510" y="390" width="780" height="230" rx="8" fill="#0d1015"/>
    <text x="900" y="500" text-anchor="middle" fill="#eae8e2" opacity="0.7" font-family="Jost, Arial" font-size="46" letter-spacing="6">${esc(v.brand.toUpperCase())}</text>
    <text x="900" y="546" text-anchor="middle" fill="#e23a46" opacity="0.75" font-family="Jost, Arial" font-size="18" letter-spacing="8">DRIVE READY</text>
    <rect x="580" y="720" width="640" height="90" rx="10" fill="#1a1d22" stroke="#c8c8c8" stroke-opacity="0.2" stroke-width="3"/>
    <circle cx="640" cy="765" r="22" fill="url(#chrome)"/>
    <circle cx="720" cy="765" r="22" fill="url(#chrome)"/>
    <circle cx="800" cy="765" r="22" fill="url(#chrome)"/>
    <circle cx="1160" cy="765" r="30" fill="#e23a46" opacity="0.8"/>
  </g>`;

const intRear = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M320 340 H1480 V860 H320 Z" fill="#0b0c0d"/>
    <path d="M420 420 C560 380 800 370 1020 380 C1220 388 1360 410 1440 460 V820 H360 V480 C360 452 384 432 420 420 Z" fill="${v.interior}" stroke="#d6c8b8" stroke-opacity="0.22" stroke-width="4"/>
    <path d="M900 420 V820" stroke="#0b0c0d" stroke-opacity="0.55" stroke-width="10"/>
    <rect x="700" y="480" width="400" height="220" rx="18" fill="#0d1015" stroke="#c8c8c8" stroke-opacity="0.25" stroke-width="3"/>
    <text x="900" y="600" text-anchor="middle" fill="#eae8e2" opacity="0.6" font-family="Jost, Arial" font-size="34" letter-spacing="6">${esc(v.brand.toUpperCase())}</text>
  </g>`;

const intDoor = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M280 260 L1520 340 V860 L280 800 Z" fill="${v.interior}" stroke="#d6c8b8" stroke-opacity="0.25" stroke-width="4"/>
    <path d="M320 420 L1480 480" stroke="url(#chrome)" stroke-width="8" opacity="0.55"/>
    <path d="M340 620 L1460 660" stroke="#0b0c0d" stroke-opacity="0.5" stroke-width="6"/>
    <rect x="620" y="500" width="360" height="140" rx="20" fill="#0d1015" stroke="url(#chrome)" stroke-width="2"/>
    <text x="800" y="580" text-anchor="middle" fill="url(#chrome)" font-family="Jost, Arial" font-size="22" letter-spacing="8">${esc(v.brand.toUpperCase())}</text>
    <circle cx="1300" cy="620" r="22" fill="url(#chrome)"/>
  </g>`;

const intHeadliner = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M260 260 L1540 260 L1440 800 L360 800 Z" fill="#1a1d22"/>
    <path d="M320 300 L1480 300 L1400 760 L400 760 Z" fill="${v.interior}" opacity="0.4"/>
    ${Array.from({ length: 60 }, (_, i) => {
      const x = 340 + (i % 12) * 100 + Math.random() * 20;
      const y = 340 + Math.floor(i / 12) * 80 + Math.random() * 20;
      return `<circle cx="${x}" cy="${y}" r="2" fill="#fff3d7" opacity="${0.4 + Math.random() * 0.4}"/>`;
    }).join("")}
    <rect x="820" y="330" width="160" height="90" rx="10" fill="#0b0c0d" stroke="url(#chrome)" stroke-width="2"/>
  </g>`;

/* ─────────── DETAIL VIEWS ─────────── */

const detWheel = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <circle cx="900" cy="594" r="330" fill="#050607"/>
    <circle cx="900" cy="594" r="246" fill="${v.wheel}" stroke="#85888c" stroke-opacity="0.55" stroke-width="12"/>
    ${Array.from({ length: 16 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 16;
      const x2 = 900 + Math.cos(a) * 205;
      const y2 = 594 + Math.sin(a) * 205;
      return `<path d="M900 594 L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#d2d4d6" stroke-opacity="0.5" stroke-width="14" stroke-linecap="round"/>`;
    }).join("")}
    <circle cx="900" cy="594" r="62" fill="#d9dadb"/>
    <text x="900" y="602" text-anchor="middle" fill="#0b0c0d" font-family="Jost, Arial" font-weight="700" font-size="12" letter-spacing="2">${esc(v.brand.slice(0, 6).toUpperCase())}</text>
  </g>`;

const detHeadlight = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M300 460 C500 380 900 360 1500 500 L1480 640 C1000 580 600 590 320 640 Z" fill="url(#paint)"/>
    <path d="M420 490 C700 430 1100 430 1420 520 L1400 610 C1080 560 720 560 440 610 Z" fill="#0b0c0d"/>
    <ellipse cx="700" cy="560" rx="130" ry="40" fill="#fff3d7" opacity="0.9" filter="url(#glow)"/>
    <ellipse cx="1100" cy="560" rx="130" ry="40" fill="#fff3d7" opacity="0.9" filter="url(#glow)"/>
    <path d="M420 590 L1400 590" stroke="#e23a46" stroke-width="4" opacity="0.7"/>
  </g>`;

const detTaillight = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M280 460 C500 400 1300 400 1520 480 L1500 640 C1000 580 800 580 300 640 Z" fill="url(#paint)"/>
    <rect x="380" y="500" width="1040" height="80" rx="20" fill="#0b0c0d"/>
    <rect x="410" y="518" width="980" height="44" rx="12" fill="#e23a46" opacity="0.85" filter="url(#glow)"/>
    <path d="M420 610 L1380 610" stroke="url(#chrome)" stroke-width="4" opacity="0.6"/>
  </g>`;

const detGrille = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M260 320 H1540 V820 H260 Z" fill="url(#paint)"/>
    <rect x="440" y="420" width="920" height="360" rx="30" fill="#0b0c0d" stroke="url(#chrome)" stroke-width="6"/>
    ${Array.from({ length: 18 }, (_, i) => `<rect x="${460 + i * 50}" y="440" width="18" height="320" fill="url(#chrome)" opacity="0.7"/>`).join("")}
    ${brandBadge(v, 900, 400, 26)}
  </g>`;

const detEmblem = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M280 300 H1520 V820 H280 Z" fill="url(#paint)"/>
    <ellipse cx="900" cy="560" rx="260" ry="140" fill="#0b0c0d" opacity="0.9"/>
    <ellipse cx="900" cy="560" rx="230" ry="120" fill="none" stroke="url(#chrome)" stroke-width="5"/>
    <text x="900" y="570" text-anchor="middle" fill="url(#chrome)" font-family="Jost, Arial" font-weight="700" font-size="42" letter-spacing="8">${esc(v.brand.toUpperCase())}</text>
    <text x="900" y="610" text-anchor="middle" fill="url(#chrome)" opacity="0.75" font-family="Jost, Arial" font-size="18" letter-spacing="6">${esc(v.model.toUpperCase())}</text>
  </g>`;

/** Detail 06/06 — paint surface. No text overlay, no logo watermark. */
const detPaintSurface = (v: StudioVehicle) => `
  <g filter="url(#shadow)">
    <path d="M260 680 C520 376 1074 276 1540 540 C1308 730 914 822 260 680 Z" fill="url(#paint)" stroke="#eae8e2" stroke-opacity="0.18" stroke-width="4"/>
    <path d="M442 614 C696 500 1004 454 1360 524" stroke="#ffffff" stroke-opacity="0.36" stroke-width="14" stroke-linecap="round"/>
    <path d="M522 714 C780 668 1060 642 1300 674" stroke="#000000" stroke-opacity="0.26" stroke-width="12" stroke-linecap="round"/>
    <path d="M600 500 C820 440 1080 430 1280 480" stroke="#ffffff" stroke-opacity="0.14" stroke-width="8" stroke-linecap="round"/>
  </g>`;

/* ─────────── CRAFT VIEWS (process shots) ─────────── */

const craftBase = (title: string, inner: string) => `
  <g filter="url(#shadow)">
    <rect x="240" y="280" width="1320" height="620" rx="18" fill="#0b0c0d" stroke="#eae8e2" stroke-opacity="0.15"/>
    ${inner}
    <text x="900" y="960" text-anchor="middle" fill="#eae8e2" opacity="0.45" font-family="Jost, Arial" font-size="16" letter-spacing="8">${esc(title)}</text>
  </g>`;

const craftCutting = (v: StudioVehicle) =>
  craftBase(
    "РАСКРОЙ PPF ПОД ЭТОТ КУЗОВ",
    `
    <path d="M320 800 C600 500 1200 460 1480 780" fill="none" stroke="url(#paint)" stroke-width="120" stroke-linecap="round"/>
    <path d="M320 800 C600 500 1200 460 1480 780" fill="none" stroke="#eae8e2" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="8 8"/>
    <circle cx="820" cy="560" r="12" fill="#e23a46"/>
    <path d="M820 560 L900 480" stroke="#e23a46" stroke-width="3"/>
    <text x="920" y="470" fill="#eae8e2" opacity="0.7" font-family="Jost, Arial" font-size="16" letter-spacing="4">РЕЗ ${esc(v.paintName.toUpperCase())}</text>`,
  );

const craftApply = (v: StudioVehicle) =>
  craftBase(
    "НАНЕСЕНИЕ ПЛЁНКИ",
    `
    <path d="M280 700 C500 500 1100 460 1520 640" fill="url(#paint)" opacity="0.9"/>
    <path d="M600 640 L1400 500" stroke="url(#chrome)" stroke-width="14" stroke-linecap="round"/>
    <circle cx="1400" cy="500" r="30" fill="#e23a46"/>
    <path d="M700 620 C900 600 1100 600 1300 620" stroke="#ffffff" stroke-opacity="0.4" stroke-width="6" fill="none"/>`,
  );

const craftPolish = (v: StudioVehicle) =>
  craftBase(
    "ПОЛИРОВКА ПОВЕРХНОСТИ",
    `
    <path d="M260 700 C500 460 1100 420 1540 640" fill="url(#paint)"/>
    <circle cx="900" cy="560" r="130" fill="#eae8e2" opacity="0.15"/>
    <circle cx="900" cy="560" r="90" fill="#eae8e2" opacity="0.25"/>
    <circle cx="900" cy="560" r="50" fill="url(#chrome)"/>
    <path d="M900 460 V420 M900 700 V740 M780 560 H740 M1020 560 H1060" stroke="url(#chrome)" stroke-width="4"/>`,
  );

const craftGauge = (v: StudioVehicle) =>
  craftBase(
    "КОНТРОЛЬ ТОЛЩИНЫ ЛАКА",
    `
    <path d="M260 700 C500 460 1100 420 1540 640" fill="url(#paint)"/>
    <rect x="780" y="440" width="240" height="140" rx="18" fill="#050607" stroke="url(#chrome)" stroke-width="3"/>
    <text x="900" y="510" text-anchor="middle" fill="#e23a46" font-family="Jost, Arial" font-weight="700" font-size="46" letter-spacing="4">${140 + (v.brand.length % 40)} µm</text>
    <text x="900" y="550" text-anchor="middle" fill="#eae8e2" opacity="0.6" font-family="Jost, Arial" font-size="14" letter-spacing="6">${esc(v.paintName.toUpperCase())}</text>
    <path d="M900 580 V680" stroke="url(#chrome)" stroke-width="6"/>
    <circle cx="900" cy="700" r="24" fill="url(#chrome)"/>`,
  );

const craftInspect = (v: StudioVehicle) =>
  craftBase(
    "СВЕТОВАЯ ИНСПЕКЦИЯ",
    `
    <path d="M260 700 C500 460 1100 420 1540 640" fill="url(#paint)"/>
    <path d="M400 300 L900 620 L1400 300" stroke="#fff3d7" stroke-opacity="0.4" stroke-width="3"/>
    <ellipse cx="900" cy="620" rx="220" ry="30" fill="#fff3d7" opacity="0.35" filter="url(#glow)"/>
    <path d="M780 640 L1020 640" stroke="#e23a46" stroke-width="4"/>`,
  );

const craftHandover = (v: StudioVehicle) => {
  const g = bodyGeometry[v.body];
  return craftBase(
    "ПРИЁМКА КЛИЕНТУ",
    `
    <g transform="translate(0 60) scale(0.72)" transform-origin="900 560">
      <g transform="translate(0 ${g.clearance}) scale(1 ${g.height})">
        <path d="${g.body}" fill="url(#paint)" stroke="#f5f2ea" stroke-opacity="0.2" stroke-width="3"/>
        <path d="${g.roof}" fill="url(#glass)" stroke="#f4f4f4" stroke-opacity="0.18" stroke-width="3"/>
        ${brandBadge(v, 900, 555)}
        ${plateLogo(815, 656)}
        ${wheel(520, 762, g.wheel, v)}${wheel(1250, 762, g.wheel, v)}
      </g>
    </g>
    <path d="M320 860 H1480" stroke="url(#chrome)" stroke-width="2" opacity="0.4"/>`,
  );
};

/* ─────────── DISPATCH ─────────── */

const RENDERERS: Array<(v: StudioVehicle) => string> = [
  // 0-5 exterior
  extFrontThreeQuarter,
  extFrontStrict,
  extRearStrict,
  (v) => extSide(v, false),
  (v) => extSide(v, true),
  extRearThreeQuarter,
  // 6-11 interior
  intCockpit,
  intWheelCluster,
  intConsole,
  intRear,
  intDoor,
  intHeadliner,
  // 12-17 detail
  detWheel,
  detHeadlight,
  detTaillight,
  detGrille,
  detEmblem,
  detPaintSurface,
  // 18-23 craft
  craftCutting,
  craftApply,
  craftPolish,
  craftGauge,
  craftInspect,
  craftHandover,
];

export function studioImage(vehicle: StudioVehicle, view = 0) {
  const v = ((view % RENDERERS.length) + RENDERERS.length) % RENDERERS.length;
  const scene = RENDERERS[v](vehicle);
  const label = CATEGORY_LABEL[v] ?? "STUDIO";
  return encode(`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1125" viewBox="0 0 1800 1125" role="img" aria-label="${esc(vehicle.brand)} ${esc(vehicle.model)} — ${esc(label)}">
    ${studioDefs(vehicle)}
    ${studioBackground(vehicle, v)}
    ${scene}
    <text x="100" y="1030" fill="#eae8e2" opacity="0.48" font-family="Cormorant Garamond, Georgia" font-size="42" letter-spacing="4">${esc(vehicle.brand)} ${esc(vehicle.model)}</text>
    <text x="100" y="1068" fill="#8d9096" opacity="0.75" font-family="Jost, Arial" font-size="13" letter-spacing="6">${esc(label)}</text>
  </svg>`);
}

export const studioGallery = (vehicle: StudioVehicle) =>
  Array.from({ length: RENDERERS.length }, (_, i) => studioImage(vehicle, i));
