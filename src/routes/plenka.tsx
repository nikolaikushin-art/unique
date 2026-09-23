import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rule } from "@/components/site/PageHero";
import { STUDIO_VEHICLES } from "@/lib/studio-vehicles";
import logo from "@/assets/logo.png.asset.json";
import { cdn } from "@/lib/cdn";
import { COLOURS } from "@/lib/film-colours";
import { pageSeo } from "@/lib/seo";

/* ─────────── Coverage packages ─────────── */
const PACKAGES = [
  {
    name: "Фронт-пакет",
    tag: "Базовая защита зон удара",
    items: ["Капот (частично)", "Передний бампер", "Крылья · зеркала", "Фары"],
    note: "Оптимально для города",
  },
  {
    name: "Трек-пакет",
    tag: "Расширенная фронтальная зона",
    items: ["Капот полностью", "Бампер и крылья", "Зеркала · пороги", "Зона за арками"],
    note: "Для активной езды",
    featured: true,
  },
  {
    name: "Полный кузов",
    tag: "Максимальная защита",
    items: ["Весь кузов целиком", "Оптика и пороги", "Зоны погрузки", "Гарантия 10 лет"],
    note: "Клубный стандарт",
  },
  {
    name: "Bespoke",
    tag: "Индивидуальный проект",
    items: [
      "Матовые и цветные плёнки",
      "Комбинация с керамикой",
      "Дизайн-акценты",
      "Личный протокол",
    ],
    note: "По согласованию",
  },
];

/* ─────────── FAQ ─────────── */
const FAQ = [
  [
    "Чем плёнка UNIQUE отличается от обычной PPF?",
    "Собственная рецептура топ-коата и полиуретанового ядра: эластичность 320%, прозрачность 99.7%, улучшенное самовосстановление и гарантия 10 лет вместо стандартных пяти.",
  ],
  [
    "Плёнку видно на кузове?",
    "Нет. Глянцевая плёнка оптически прозрачна и повторяет глубину лака. Кромки заводятся под панели, поэтому переходов не видно даже вблизи.",
  ],
  [
    "Нужно ли разбирать автомобиль?",
    "Нет. Мы работаем без снятия оптики, ручек и эмблем — плёнка укладывается по месту с заводом под кромки.",
  ],
  [
    "Сколько времени занимает оклейка?",
    "От 2–3 дней для фронт-пакета до 7–10 дней для полного кузова. Точный срок зависит от модели и состояния ЛКП.",
  ],
  [
    "Как ухаживать за плёнкой?",
    "Обычная бесконтактная мойка. Мелкие царапины затягиваются при нагреве. Раз в год — бесплатная клубная ревизия покрытия.",
  ],
  [
    "Можно ли снять плёнку без вреда для лака?",
    "Да. Клеевой слой paint-safe: плёнка снимается без остатков клея и следов на заводском лакокрасочном покрытии.",
  ],
];

export const Route = createFileRoute("/plenka")({
  head: () =>
    pageSeo({
      title: "Плёнка UNIQUE — премиальная защитная плёнка PPF",
      description:
        "UNIQUE PPF — премиальная полиуретановая защитная плёнка: технология материала, брендированная упаковка, гидрофобность и самовосстановление, коллекция покрытий и портфолио оклеенных автомобилей.",
      path: "/plenka",
      ogDescription:
        "Материал, технология, упаковка и портфолио защитной плёнки UNIQUE PPF мирового уровня.",
    }),
  component: PlenkaPage,
});

/* ═══════════════ UNIQUE PPF product / technology imagery ═══════════════
 * Studio-generated brand & material photography under /public/ppf.
 * Every branded shot carries the physical «UNIQUE · DETAILING» wordmark. */
const PPF = {
  hero: cdn("/ppf/ppf-hero.jpg"),
  clarity: cdn("/ppf/ppf-clarity.jpg"),
  hydrophobic: cdn("/ppf/ppf-hydrophobic.jpg"),
  selfheal: cdn("/ppf/ppf-selfheal.jpg"),
  layers: cdn("/ppf/ppf-layers.jpg"),
  roll: cdn("/ppf/ppf-roll.jpg"),
  box: cdn("/ppf/ppf-box.jpg"),
  boxes: cdn("/ppf/ppf-boxes.jpg"),
  caseKit: cdn("/ppf/ppf-case.jpg"),
  shelf: cdn("/ppf/ppf-shelf.jpg"),
  gloss: cdn("/ppf/ppf-gloss.jpg"),
  matte: cdn("/ppf/ppf-matte.jpg"),
  special: cdn("/ppf/ppf-special.jpg"),
  before: cdn("/ppf/ppf-before.jpg"),
  after: cdn("/ppf/ppf-after.jpg"),
  installCut: cdn("/ppf/ppf-install-cut.jpg"),
  installApply: cdn("/ppf/ppf-install-apply.jpg"),
  installInspect: cdn("/ppf/ppf-install-inspect.jpg"),
  // New brand & material photography (official-logo product line)
  rollsDuo: cdn("/ppf/ppf-rolls-duo.jpg"),
  suite: cdn("/ppf/ppf-suite.jpg"),
  swatches: cdn("/ppf/ppf-swatches.jpg"),
  core: cdn("/ppf/ppf-core.jpg"),
  beading: cdn("/ppf/ppf-beading.jpg"),
  heal2: cdn("/ppf/ppf-heal2.jpg"),
  apply2: cdn("/ppf/ppf-apply2.jpg"),
  knife2: cdn("/ppf/ppf-knife2.jpg"),
} as const;

/* ─────────── Vehicle demonstration data (the 30% — cars proving the film) ─────────── */
type Demo = {
  slug: string;
  brand: string;
  model: string;
  finish: string;
  hero: string;
  details: { img: string; label: string }[];
};

const DEMOS: Demo[] = [
  {
    slug: "lamborghini-revuelto",
    brand: "Lamborghini",
    model: "Revuelto",
    finish: "Full Body PPF · Arancio Borealis",
    hero: cdn("/portfolio/lamborghini-revuelto-0.jpg"),
    details: [
      { img: cdn("/portfolio/lamborghini-revuelto-det-4.jpg"), label: "Передний сплиттер" },
      { img: cdn("/portfolio/lamborghini-revuelto-det-2.jpg"), label: "Оптика · защита фар" },
      { img: cdn("/portfolio/lamborghini-revuelto-det-1.jpg"), label: "Изгиб кузова" },
    ],
  },
  {
    slug: "ferrari-sf90-stradale",
    brand: "Ferrari",
    model: "SF90 Stradale",
    finish: "Full Body PPF · Rosso Corsa",
    hero: cdn("/portfolio/ferrari-sf90-stradale-0.jpg"),
    details: [
      { img: cdn("/portfolio/ferrari-sf90-stradale-det-4.jpg"), label: "Капот и решётка" },
      { img: cdn("/portfolio/ferrari-sf90-stradale-det-5.jpg"), label: "Зеркало и кромка" },
      { img: cdn("/portfolio/ferrari-sf90-stradale-det-1.jpg"), label: "Колесо и арка" },
    ],
  },
  {
    slug: "rolls-royce-phantom-series-ii",
    brand: "Rolls-Royce",
    model: "Phantom Series II",
    finish: "Full Body PPF · Infinity Black",
    hero: cdn("/portfolio/rolls-royce-phantom-series-ii-0.jpg"),
    details: [
      { img: cdn("/portfolio/rolls-royce-phantom-series-ii-det-4.jpg"), label: "Капот и кромки" },
      { img: cdn("/portfolio/rolls-royce-phantom-series-ii-det-2.jpg"), label: "Оптика" },
      { img: cdn("/portfolio/rolls-royce-phantom-series-ii-det-5.jpg"), label: "Зеркало" },
    ],
  },
  {
    slug: "mercedes-benz-g-63-amg",
    brand: "Mercedes-Benz",
    model: "G 63 AMG",
    finish: "Full Body PPF · Graphite Magno",
    hero: cdn("/portfolio/mercedes-benz-g-63-amg-0.jpg"),
    details: [
      { img: cdn("/portfolio/mercedes-benz-g-63-amg-det-4.jpg"), label: "Фронтальная зона" },
      { img: cdn("/portfolio/mercedes-benz-g-63-amg-det-2.jpg"), label: "Оптика" },
      { img: cdn("/portfolio/mercedes-benz-g-63-amg-det-1.jpg"), label: "Колесо и арка" },
    ],
  },
];

/* ─────────── Material technology (protection concepts) ─────────── */
const PROTECTION = [
  ["Самовосстановление", "Мелкие царапины и следы моек исчезают при нагреве от 40 °C."],
  ["Стойкость к сколам", "Полиуретан 210 µm поглощает удары щебня, песка и гравия."],
  ["UV-защита", "Стабилизаторы не дают лаку выгорать и желтеть под солнцем."],
  ["Гидрофобность", "Вода собирается в капли и скатывается, унося грязь и реагенты."],
  ["Химическая стойкость", "Не реагирует на битум, антигололёд, насекомых и кислотные осадки."],
  ["Защита от загрязнений", "Гладкий топ-коат не даёт грязи закрепляться на поверхности."],
];

/* ─────────── Finish collection ─────────── */
const FINISHES = [
  {
    img: PPF.gloss,
    name: "UNIQUE Gloss",
    tag: "Глянцевая защита",
    desc: "Зеркальные отражения и максимальная глубина лака. Плёнка усиливает цвет и делает поверхность визуально «мокрой».",
    specs: ["Прозрачность 99.7%", "Эффект глубины лака", "Максимальный глянец"],
    example: "Ferrari · Rolls-Royce · Porsche",
  },
  {
    img: PPF.matte,
    name: "UNIQUE Stealth",
    tag: "Матовое / сатиновое покрытие",
    desc: "Превращает глянцевый лак в благородный сатин без потери защиты. Эксклюзивный сдержанный характер.",
    specs: ["Сатиновая текстура", "Стелс-эффект", "Полная защита кузова"],
    example: "BMW M · Audi Sport · G-Class",
  },
  {
    img: PPF.special,
    name: "UNIQUE Special",
    tag: "Специальные покрытия",
    desc: "Colour-shift и лимитированные финиши для индивидуальных проектов и клубных автомобилей.",
    specs: ["Colour-shift", "Лимитированные партии", "Индивидуальный проект"],
    example: "Bespoke · клубные проекты",
  },
];

/* ─────────── Pairing system (Vehicle + Material + Film detail) ─────────── */
type Pairing = {
  n: string;
  veh: string;
  brand: string;
  model: string;
  material: string;
  materialName: string;
  materialTag: string;
  detail: string;
  detailName: string;
  detailTag: string;
  note: string;
};

const PAIRINGS: Pairing[] = [
  {
    n: "01",
    veh: cdn("/portfolio/rolls-royce-phantom-series-ii-0.jpg"),
    brand: "Rolls-Royce",
    model: "Phantom Series II",
    material: cdn("/ppf/ppf-gloss.jpg"),
    materialName: "UNIQUE Gloss",
    materialTag: "Полная оклейка кузова",
    detail: cdn("/ppf/ppf-c-piano-black.jpg"),
    detailName: "Piano Black",
    detailTag: "Глянец · отражение",
    note: "Глянцевая плёнка повторяет глубину лака Infinity Black — защита невидима, кузов нетронут.",
  },
  {
    n: "02",
    veh: cdn("/portfolio/lamborghini-revuelto-0.jpg"),
    brand: "Lamborghini",
    model: "Revuelto",
    material: cdn("/ppf/ppf-special.jpg"),
    materialName: "UNIQUE Special",
    materialTag: "Ударная зона · трек",
    detail: cdn("/ppf/ppf-band-edge.jpg"),
    detailName: "Кромка плёнки",
    detailTag: "Прозрачность 99.7%",
    note: "Фронтальная зона и арки под ядром 210 µm — щебень и трек без единого скола.",
  },
  {
    n: "03",
    veh: cdn("/portfolio/mercedes-benz-g-63-amg-0.jpg"),
    brand: "Mercedes-Benz",
    model: "G 63 AMG",
    material: cdn("/ppf/ppf-matte.jpg"),
    materialName: "UNIQUE Stealth",
    materialTag: "Сатиновое покрытие",
    detail: cdn("/ppf/ppf-c-satin-black.jpg"),
    detailName: "Satin Black",
    detailTag: "Стелс · матовость",
    note: "Graphite Magno в сатине: матовый характер и полная защита кузова одной плёнкой.",
  },
];

const LAYERS = [
  ["01", "Топ-коат", "Самовосстанавливающийся слой — глянец, гидрофобность, стойкость к химии."],
  [
    "02",
    "Полиуретан 210 µm",
    "Эластичное ядро 320% — поглощает удары и повторяет геометрию кузова.",
  ],
  ["03", "Клеевой слой", "Paint-safe адгезив с воздушными каналами — снимается без следа на лаке."],
];

/* ─────────── Vehicle portfolio (filterable gallery) ─────────── */
const PPF_CATEGORIES = [
  "Все проекты",
  "Full Body PPF",
  "Supercar Collection",
  "Luxury Collection",
  "SUV Protection",
  "Matte & Special Finishes",
  "Front Protection",
] as const;
type PpfCategory = (typeof PPF_CATEGORIES)[number];

type Project = {
  brand: string;
  model: string;
  finish: string;
  category: Exclude<PpfCategory, "Все проекты">;
  img: string;
};

const categoryFor = (paintName: string, body: string, brand: string): Project["category"] => {
  if (/(satin|matte|magno|frozen|nardo)/i.test(paintName)) return "Matte & Special Finishes";
  if (body === "suv") return "SUV Protection";
  if (body === "supercar" || body === "hypercar") return "Supercar Collection";
  if (/(rolls|bentley|maybach)/i.test(brand)) return "Luxury Collection";
  return "Full Body PPF";
};

const FINISH_LABEL: Record<Project["category"], string> = {
  "Full Body PPF": "Полная оклейка кузова",
  "Supercar Collection": "Суперкар · полный корпус",
  "Luxury Collection": "Люкс · клубный протокол",
  "SUV Protection": "Внедорожник · защита кузова",
  "Matte & Special Finishes": "Матовое / специальное покрытие",
  "Front Protection": "Защита фронтальной зоны",
};

const EXTERIOR_PROJECTS: Project[] = STUDIO_VEHICLES.map((v) => {
  const category = categoryFor(v.paintName, v.body, v.brand);
  return {
    brand: v.brand,
    model: v.model,
    finish: `${FINISH_LABEL[category]} · ${v.paintName}`,
    category,
    img: cdn(`/portfolio/${v.slug}-ext-3.jpg`),
  };
});

const FRONT_PROJECTS: Project[] = [
  {
    brand: "Porsche",
    model: "911 GT3 RS",
    finish: "Track PPF · Gloss White",
    category: "Supercar Collection",
    img: cdn("/portfolio/porsche-911-gt3-rs-ppf.jpg"),
  },
  {
    brand: "Ferrari",
    model: "Roma",
    finish: "Clear Bra · решётка и капот",
    category: "Front Protection",
    img: cdn("/portfolio/ferrari-roma-det-4.jpg"),
  },
  {
    brand: "Aston Martin",
    model: "DB12",
    finish: "Clear Bra · оптика",
    category: "Front Protection",
    img: cdn("/portfolio/aston-martin-db12-det-2.jpg"),
  },
  {
    brand: "Porsche",
    model: "911 Turbo S",
    finish: "Track front · защита носа",
    category: "Front Protection",
    img: cdn("/portfolio/porsche-911-turbo-s-det-2.jpg"),
  },
  {
    brand: "Lamborghini",
    model: "Revuelto",
    finish: "Front splitter PPF",
    category: "Front Protection",
    img: cdn("/portfolio/lamborghini-revuelto-det-4.jpg"),
  },
  {
    brand: "BMW",
    model: "XM Label Red",
    finish: "Front guard · решётка",
    category: "Front Protection",
    img: cdn("/portfolio/bmw-xm-label-red-det-4.jpg"),
  },
  {
    brand: "McLaren",
    model: "750S Spider",
    finish: "Nose PPF · оптика",
    category: "Front Protection",
    img: cdn("/portfolio/mclaren-750s-spider-det-2.jpg"),
  },
];

const PROJECTS: Project[] = [...EXTERIOR_PROJECTS, ...FRONT_PROJECTS];

const PROPERTIES = [
  [
    "Эластичность 320%",
    "Плёнка тянется без разрыва и повторяет самую сложную геометрию — воздухозаборники, арки, зеркала.",
  ],
  [
    "Самовосстановление",
    "Мелкие царапины исчезают при нагреве от 40°C — от солнца, тёплой воды или фена.",
  ],
  [
    "Устойчивость к химии",
    "Не реагирует на реагенты, антигололёд, кислотные осадки, битум и продукты сгорания.",
  ],
  [
    "Прозрачность 99.7%",
    "Практически неотличима на кузове — глубина цвета лака сохраняется полностью.",
  ],
  [
    "Гарантия 10 лет",
    "На пожелтение, отслоение, помутнение и потерю самовосстанавливающих свойств.",
  ],
  [
    "Толщина 210 микрон",
    "Три слоя — топ-коат, полиуретан и клеевой слой с воздушными каналами для идеальной укладки.",
  ],
];

/* ═══════════════ Before / After comparison slider ═══════════════ */
function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      setFromClientX(e.clientX);
    };
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden border border-line"
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
    >
      {/* AFTER — protected surface (full width base) */}
      <img
        src={PPF.after}
        alt="После — поверхность под защитой UNIQUE PPF"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <span className="absolute bottom-4 right-4 z-10 border border-ivory/30 bg-obsidian/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-ivory backdrop-blur-sm">
        После · UNIQUE PPF
      </span>

      {/* BEFORE — original paint, clipped */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={PPF.before}
          alt="До — незащищённый лак со следами эксплуатации"
          className="absolute inset-0 h-full max-w-none object-cover"
          style={{ width: width || "100%" }}
          draggable={false}
        />
        <span className="absolute bottom-4 left-4 z-10 border border-ivory/30 bg-obsidian/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-ivory backdrop-blur-sm">
          До
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 z-20 flex items-center"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ivory/80" />
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ivory/60 bg-obsidian/80 text-ivory backdrop-blur">
          <span className="text-[13px] tracking-tight">‹ ›</span>
        </span>
      </div>
    </div>
  );
}

function PlenkaPage() {
  const [cat, setCat] = useState<PpfCategory>("Все проекты");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const list = useMemo(
    () => (cat === "Все проекты" ? PROJECTS : PROJECTS.filter((p) => p.category === cat)),
    [cat],
  );

  const counts = useMemo(() => {
    const m = new Map<PpfCategory, number>();
    m.set("Все проекты", PROJECTS.length);
    for (const c of PPF_CATEGORIES)
      if (c !== "Все проекты") m.set(c, PROJECTS.filter((p) => p.category === c).length);
    return m;
  }, []);

  useEffect(() => {
    setLightbox(null);
  }, [cat]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((v) => (v === null ? v : (v + 1) % list.length));
      if (e.key === "ArrowLeft")
        setLightbox((v) => (v === null ? v : (v - 1 + list.length) % list.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, list.length]);

  return (
    <div>
      {/* ═══════════ CINEMATIC HERO ═══════════ */}
      <section className="relative flex min-h-screen items-end overflow-hidden border-b border-line">
        <img
          src={PPF.hero}
          alt="UNIQUE PPF — премиальная защитная плёнка"
          className="absolute inset-0 h-full w-full animate-drift object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 plate-scrim" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/85 via-obsidian/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-[6vw] pb-24 pt-40">
          <p className="eyebrow eyebrow-dot mb-6">UNIQUE PPF · Paint Protection Film</p>
          <h1
            className="max-w-[1200px] font-display uppercase leading-[0.96] text-ivory"
            style={{ fontSize: "clamp(44px,7.6vw,132px)", letterSpacing: "0.02em" }}
          >
            Невидимая
            <br />
            защита
            <br />
            <span className="text-ember">высшего класса.</span>
          </h1>
          <p className="mt-8 max-w-[640px] text-[16px] leading-[1.9] text-mute">
            UNIQUE PPF — это не услуга, а премиальный материал: собственная полиуретановая плёнка,
            инженерная технология, брендированная упаковка и ручная оклейка люксовых автомобилей.
          </p>
          <div className="mt-12 grid max-w-[720px] grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
            {[
              ["99.7%", "прозрачность"],
              ["320%", "эластичность"],
              ["210 µm", "толщина плёнки"],
              ["10 лет", "гарантия"],
            ].map(([n, l]) => (
              <div key={l} className="bg-obsidian/85 px-6 py-6 backdrop-blur">
                <p
                  className="font-display text-ember"
                  style={{ fontSize: "clamp(26px,2.6vw,38px)" }}
                >
                  {n}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-mute-2">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 right-[6vw] z-10 hidden items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-mute-2 md:flex">
          <span>Материал · технология · портфолио</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-mute-2" />
        </div>
      </section>

      {/* ═══════════ BRAND MANIFESTO ═══════════ */}
      <section className="px-[6vw] py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6 text-[15.5px] leading-[1.95] text-mute">
            <p className="eyebrow eyebrow-dot">Материал, а не просто услуга</p>
            <h2
              className="font-display uppercase leading-[1.05] text-ivory"
              style={{ fontSize: "clamp(30px,3.8vw,54px)", letterSpacing: "0.04em" }}
            >
              UNIQUE PPF —<br />
              <span className="text-ember">инженерная защита.</span>
            </h2>
            <p>
              Собственная полиуретановая плёнка ограниченными партиями: рецептура топ-коата, ядра и
              клеевого слоя отработана на реальных автомобилях. Прозрачность 99.7%,
              самовосстановление, гидрофобность и гарантия 10 лет — уровень международного бренда.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={PPF.clarity}
              alt="Макро прозрачной плёнки UNIQUE PPF"
              className="h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 plate-scrim" />
            <p className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.35em] text-ivory">
              Топ-коат · оптическая чистота
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ FILM COLOUR & FINISH COLLECTION ═══════════ */}
      <section className="border-t border-line bg-obsidian-2 px-[6vw] py-32">
        <div className="mx-auto max-w-[1600px]">
          <Rule label="Коллекция плёнок UNIQUE" num="01" />
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2
              className="max-w-[820px] font-display uppercase leading-tight text-ivory"
              style={{ fontSize: "clamp(28px,3.6vw,52px)", letterSpacing: "0.04em" }}
            >
              Палитра
              <br />
              <span className="text-ember">защитных финишей.</span>
            </h2>
            <p className="max-w-[400px] text-[13.5px] leading-[1.85] text-mute">
              Глянец, сатин, мат, металлик и цвет — {COLOURS.length} премиальных финишей UNIQUE PPF,
              подобранных под характер каждого автомобиля.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {COLOURS.map((c) => (
              <figure key={c.name} className="group relative overflow-hidden bg-obsidian">
                <div className="aspect-[4/3]">
                  <img
                    src={c.img}
                    alt={`UNIQUE PPF — ${c.name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 plate-scrim" />
                <span className="absolute right-3 top-3 border border-ivory/25 bg-obsidian/45 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.26em] text-ivory backdrop-blur-sm">
                  {c.type}
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <h3
                    className="font-display text-base uppercase leading-none text-ivory md:text-lg"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {c.name}
                  </h3>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CINEMATIC BAND — GLOSS REFLECTION ═══════════ */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden border-y border-line">
        <img
          src={cdn("/ppf/ppf-band-reflection.jpg")}
          alt="UNIQUE PPF — глянцевое отражение на кузове"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-transparent to-transparent" />
        <div className="relative z-10 w-full px-[6vw] pb-20">
          <p className="eyebrow eyebrow-dot mb-5">Оптическая глубина</p>
          <h2
            className="max-w-[900px] font-display uppercase leading-[1.02] text-ivory"
            style={{ fontSize: "clamp(30px,4.6vw,72px)", letterSpacing: "0.02em" }}
          >
            Свет ложится <span className="text-ember">чисто.</span>
          </h2>
        </div>
      </section>

      {/* ═══════════ BRAND IDENTITY BAND ═══════════ */}
      <section className="relative overflow-hidden border-y border-line bg-obsidian px-[6vw] py-24 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,rgba(234,232,226,0.6) 0 1px,transparent 1px 44px)",
          }}
        />
        <div className="relative mx-auto flex max-w-[1100px] flex-col items-center text-center">
          <img src={logo.url} alt="UNIQUE Detailing" className="h-16 w-auto md:h-20" />
          <div className="mt-8 h-px w-16 bg-ember" />
          <p className="mt-8 max-w-[680px] text-[15px] leading-[1.95] text-mute">
            UNIQUE PPF — собственный бренд защитных плёнок. Единая айдентика от рулона и упаковки до
            оклеенного автомобиля: материал, произведённый и нанесённый под одним именем.
          </p>
        </div>
      </section>

      {/* ═══════════ PREMIUM PAIRING SYSTEM ═══════════ */}
      <section className="border-b border-line px-[6vw] py-32">
        <div className="mx-auto max-w-[1500px]">
          <Rule label="Автомобиль · материал · плёнка" num="02" />
          <div className="mb-14 max-w-[860px]">
            <h2
              className="font-display uppercase leading-tight text-ivory"
              style={{ fontSize: "clamp(28px,3.6vw,52px)", letterSpacing: "0.04em" }}
            >
              Автомобиль
              <br />
              <span className="text-ember">и его защита.</span>
            </h2>
            <p className="mt-6 max-w-[560px] text-[15px] leading-[1.9] text-mute">
              Каждый проект — это связка: автомобиль, подобранный материал UNIQUE PPF и финиш
              плёнки, который раскрывает его характер.
            </p>
          </div>

          <div className="space-y-2">
            {PAIRINGS.map((p) => (
              <div key={p.n} className="grid gap-2 lg:grid-cols-[1.55fr_1fr] lg:items-stretch">
                {/* Vehicle */}
                <div className="group relative overflow-hidden bg-obsidian">
                  <div className="aspect-[16/10] h-full">
                    <img
                      src={p.veh}
                      alt={`${p.brand} ${p.model}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 plate-scrim" />
                  <span className="absolute left-5 top-5 border border-ivory/30 bg-obsidian/50 px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-ivory backdrop-blur-sm">
                    {p.n} · Проект
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <h3
                      className="font-display text-2xl uppercase text-ivory"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      {p.brand} <span className="text-ember">{p.model}</span>
                    </h3>
                    <p className="mt-3 max-w-[440px] text-[13px] leading-[1.7] text-mute">
                      {p.note}
                    </p>
                  </div>
                </div>

                {/* Material + Product */}
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  <figure className="group relative overflow-hidden bg-obsidian">
                    <div className="aspect-[16/9] h-full">
                      <img
                        src={p.material}
                        alt={p.materialName}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 plate-scrim" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[9px] uppercase tracking-[0.28em] text-mute-2">
                        {p.materialTag}
                      </p>
                      <p
                        className="mt-1 font-display text-lg uppercase text-ivory"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        {p.materialName}
                      </p>
                    </figcaption>
                  </figure>
                  <figure className="group relative overflow-hidden bg-obsidian">
                    <div className="aspect-[16/9] h-full">
                      <img
                        src={p.detail}
                        alt={p.detailName}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 plate-scrim" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[9px] uppercase tracking-[0.28em] text-mute-2">
                        {p.detailTag}
                      </p>
                      <p
                        className="mt-1 font-display text-lg uppercase text-ivory"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        {p.detailName}
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ MATERIAL TECHNOLOGY ═══════════ */}
      <section className="px-[6vw] py-32">
        <div className="mx-auto max-w-[1500px]">
          <Rule label="Технология материала" num="03" />
          <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="relative aspect-[16/11] overflow-hidden border border-line">
              <img
                src={PPF.layers}
                alt="Многослойная структура плёнки UNIQUE PPF"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
              <p className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.35em] text-ivory">
                Топ-коат · полиуретан · клей
              </p>
            </div>
            <div>
              <h2
                className="font-display uppercase leading-tight text-ivory"
                style={{ fontSize: "clamp(26px,3.2vw,44px)", letterSpacing: "0.04em" }}
              >
                Три слоя <span className="text-ember">инженерии.</span>
              </h2>
              <p className="mt-6 max-w-[560px] text-[15px] leading-[1.9] text-mute">
                Плёнка UNIQUE PPF — это не покрытие «поверх», а точно рассчитанный сэндвич из трёх
                функциональных слоёв, каждый со своей задачей.
              </p>
              <div className="mt-10 divide-y divide-line border-y border-line">
                {LAYERS.map(([n, t, d]) => (
                  <div key={n} className="flex gap-6 py-6">
                    <span className="font-display text-2xl text-ember">{n}</span>
                    <div>
                      <h3
                        className="font-display text-lg uppercase text-ivory"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        {t}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-[1.8] text-mute">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protection concept grid */}
          <div className="mt-16 grid gap-[2px] bg-line sm:grid-cols-2 lg:grid-cols-3">
            {PROTECTION.map(([t, d]) => (
              <div key={t} className="bg-obsidian p-8">
                <h3
                  className="font-display text-base uppercase text-ivory"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {t}
                </h3>
                <p className="mt-4 text-[13.5px] leading-[1.8] text-mute">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HYDROPHOBIC & SELF-HEALING DEMO ═══════════ */}
      <section className="border-y border-line bg-obsidian-2 px-[6vw] py-32">
        <div className="mx-auto max-w-[1500px]">
          <Rule label="Демонстрация технологий" num="04" />
          <div className="grid gap-2 md:grid-cols-2">
            {[
              {
                img: cdn("/ppf/ppf-band-beading.jpg"),
                tag: "Гидрофобность",
                title: "Вода скатывается сама",
                body: "Топ-коат превращает воду в плотные капли — они скатываются, унося грязь и реагенты.",
              },
              {
                img: PPF.heal2,
                tag: "Самовосстановление",
                title: "Царапины исчезают от тепла",
                body: "Мелкие царапины и следы моек затягиваются при нагреве от 40 °C — от солнца, воды или фена.",
              },
            ].map((d) => (
              <figure key={d.tag} className="group relative overflow-hidden">
                <div className="aspect-[16/10]">
                  <img
                    src={d.img}
                    alt={d.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 plate-scrim" />
                <figcaption className="absolute inset-x-0 bottom-0 p-8">
                  <p className="eyebrow eyebrow-dot mb-3">{d.tag}</p>
                  <h3
                    className="font-display text-xl uppercase text-ivory"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {d.title}
                  </h3>
                  <p className="mt-3 max-w-[440px] text-[13.5px] leading-[1.8] text-mute">
                    {d.body}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINISH COLLECTION ═══════════ */}
      <section className="px-[6vw] py-32">
        <div className="mx-auto max-w-[1500px]">
          <Rule label="Фирменные финиши UNIQUE" num="05" />
          <div className="mb-12 max-w-[720px]">
            <h2
              className="font-display uppercase leading-tight text-ivory"
              style={{ fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "0.04em" }}
            >
              Три характера
              <br />
              <span className="text-ember">одной защиты.</span>
            </h2>
          </div>
          <div className="grid gap-2 lg:grid-cols-3">
            {FINISHES.map((f) => (
              <article key={f.name} className="group flex flex-col border border-line bg-obsidian">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 border border-ivory/30 bg-obsidian/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.28em] text-ivory backdrop-blur-sm">
                    {f.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <h3
                    className="font-display text-2xl uppercase text-ivory"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {f.name}
                  </h3>
                  <p className="mt-4 text-[13.5px] leading-[1.8] text-mute">{f.desc}</p>
                  <ul className="mt-6 space-y-2">
                    {f.specs.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] text-mute-2"
                      >
                        <span className="h-px w-4 bg-ember" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-8 text-[11px] uppercase tracking-[0.28em] text-mute">
                    Применение: <span className="text-ivory">{f.example}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BEFORE / AFTER ═══════════ */}
      <section className="border-y border-line bg-obsidian-2 px-[6vw] py-32">
        <div className="mx-auto max-w-[1200px]">
          <Rule label="До и после защиты" num="06" />
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2
              className="font-display uppercase leading-tight text-ivory"
              style={{ fontSize: "clamp(26px,3.2vw,46px)", letterSpacing: "0.04em" }}
            >
              До и после защиты
            </h2>
            <p className="max-w-[360px] text-[13.5px] leading-[1.85] text-mute">
              Слева — незащищённый лак со следами эксплуатации. Справа — поверхность под плёнкой
              UNIQUE PPF: глубже, глянцевее, защищённее.
            </p>
          </div>
          <BeforeAfter />
        </div>
      </section>

      {/* ═══════════ VEHICLE DEMONSTRATION PORTFOLIO ═══════════ */}
      <section className="px-[6vw] py-32">
        <div className="mx-auto max-w-[1500px]">
          <Rule label="Автомобили под защитой UNIQUE" num="07" />
          <div className="mb-14 max-w-[760px]">
            <h2
              className="font-display uppercase leading-tight text-ivory"
              style={{ fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "0.04em" }}
            >
              Плёнка на реальных
              <br />
              <span className="text-ember">люксовых проектах.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.9] text-mute">
              Каждый проект — полная оклейка и детальные кадры зон защиты: капот, фронтальная зона,
              оптика, зеркала, кромки и изгибы кузова. Плёнка невидима, глянец сохранён.
            </p>
          </div>

          <div className="space-y-16">
            {DEMOS.map((d, di) => (
              <div key={d.slug} className="grid gap-2 lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
                <Link
                  to="/raboty/$slug"
                  params={{ slug: d.slug }}
                  className="group relative block overflow-hidden bg-obsidian"
                >
                  <div className="aspect-[16/10] h-full">
                    <img
                      src={d.hero}
                      alt={`${d.brand} ${d.model}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 plate-scrim" />
                  <span className="absolute left-5 top-5 border border-ivory/30 bg-obsidian/50 px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-ivory backdrop-blur-sm">
                    {String(di + 1).padStart(2, "0")} · Demonstration
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <h3
                      className="font-display text-2xl uppercase text-ivory"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      {d.brand} <span className="text-ember">{d.model}</span>
                    </h3>
                    <p className="mt-2 text-[12px] uppercase tracking-[0.28em] text-mute">
                      {d.finish}
                    </p>
                  </div>
                </Link>

                <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                  {d.details.map((det) => (
                    <figure key={det.img} className="group relative overflow-hidden bg-obsidian">
                      <div className="aspect-[4/3] lg:aspect-[16/9]">
                        <img
                          src={det.img}
                          alt={`${d.brand} ${d.model} — ${det.label}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 plate-scrim" />
                      <figcaption className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.28em] text-ivory">
                        {det.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FILTERABLE PORTFOLIO ═══════════ */}
      <section className="border-t border-line bg-obsidian-2 px-[6vw] py-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow eyebrow-dot mb-4">Полный каталог применений</p>
              <h2
                className="font-display uppercase leading-tight text-ivory"
                style={{ fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "0.04em" }}
              >
                Коллекция
                <br />
                <span className="text-ember">оклеенных автомобилей.</span>
              </h2>
            </div>
            <p className="max-w-[360px] text-[13.5px] leading-[1.85] text-mute">
              {list.length} проектов с оклейкой UNIQUE PPF — от прозрачной защиты до смены цвета.
            </p>
          </div>

          {/* Category filter */}
          <div className="mb-10 flex flex-wrap gap-2">
            {PPF_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`flex items-center gap-2 border px-5 py-2.5 text-[10px] uppercase tracking-[0.28em] transition-all duration-300 ${
                  cat === c
                    ? "border-ember bg-ember text-obsidian"
                    : "border-line-strong text-mute hover:border-ivory hover:text-ivory"
                }`}
              >
                {c}
                <span className={`text-[9px] ${cat === c ? "text-obsidian/70" : "text-mute-2"}`}>
                  {counts.get(c)}
                </span>
              </button>
            ))}
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p, i) => (
              <button
                key={p.img}
                type="button"
                onClick={() => setLightbox(i)}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-obsidian text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                aria-label={`${p.brand} ${p.model} — открыть кадр`}
              >
                <img
                  src={p.img}
                  alt={`${p.brand} ${p.model} — ${p.finish}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition-all duration-[1200ms] ease-out group-hover:scale-[1.07] group-hover:opacity-100"
                />
                <div className="absolute inset-0 plate-scrim" />
                <span className="absolute left-4 top-4 z-10 border border-ivory/30 bg-obsidian/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.28em] text-ivory backdrop-blur-sm">
                  {p.category === "Front Protection" ? "Front" : p.category.split(" ")[0]}
                </span>
                <div className="relative z-10 translate-y-2 p-5 transition-transform duration-500 group-hover:translate-y-0">
                  <h3
                    className="font-display uppercase leading-tight text-ivory"
                    style={{ fontSize: "19px", letterSpacing: "0.05em" }}
                  >
                    {p.brand}
                  </h3>
                  <p className="mt-1 text-[13px] text-ivory/90">{p.model}</p>
                  <p className="mt-2 max-h-0 overflow-hidden text-[11px] leading-[1.6] text-mute opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100">
                    {p.finish}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CINEMATIC BAND — STEALTH SATIN ═══════════ */}
      <section className="relative flex min-h-[58vh] items-end overflow-hidden border-y border-line">
        <img
          src={cdn("/ppf/ppf-band-satin.jpg")}
          alt="UNIQUE PPF — сатиновое стелс-покрытие"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-obsidian/75 via-transparent to-transparent" />
        <div className="relative z-10 ml-auto w-full px-[6vw] pb-20 text-right">
          <p className="eyebrow eyebrow-dot mb-5">Stealth · сатин</p>
          <h2
            className="ml-auto max-w-[900px] font-display uppercase leading-[1.02] text-ivory"
            style={{ fontSize: "clamp(30px,4.6vw,72px)", letterSpacing: "0.02em" }}
          >
            Матовый характер, <span className="text-ember">полная защита.</span>
          </h2>
        </div>
      </section>

      {/* ═══════════ INSTALLATION & CRAFTSMANSHIP ═══════════ */}
      <section className="px-[6vw] py-32">
        <div className="mx-auto max-w-[1500px]">
          <Rule label="Установка и мастерство" num="08" />
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2
              className="max-w-[760px] font-display uppercase leading-tight text-ivory"
              style={{ fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "0.04em" }}
            >
              Оклейка вручную,
              <br />
              <span className="text-ember">без права на ошибку.</span>
            </h2>
            <p className="max-w-[380px] text-[13.5px] leading-[1.85] text-mute">
              Прецизионный раскрой, укладка без разбора автомобиля, прогрев каждого шва и финальный
              контроль под инспекционным светом.
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {[
              {
                img: PPF.knife2,
                step: "01",
                title: "Прецизионный раскрой",
                body: "Лекала под модель и ручная подрезка кромок для незаметных стыков.",
              },
              {
                img: PPF.apply2,
                step: "02",
                title: "Укладка плёнки",
                body: "Влажный монтаж, вытеснение воды и пузырей по сложной геометрии кузова.",
              },
              {
                img: PPF.installInspect,
                step: "03",
                title: "Контроль качества",
                body: "Проверка каждой кромки под ярким инспекционным светом.",
              },
            ].map((s) => (
              <figure key={s.step} className="group relative overflow-hidden bg-obsidian">
                <div className="aspect-[4/5]">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 plate-scrim" />
                <figcaption className="absolute inset-x-0 bottom-0 p-7">
                  <p className="font-display text-2xl text-ember">{s.step}</p>
                  <h3
                    className="mt-3 font-display text-lg uppercase text-ivory"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-[1.7] text-mute">{s.body}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TECHNICAL PROPERTIES ═══════════ */}
      <section className="border-t border-line bg-obsidian-2 px-[6vw] py-32">
        <div className="mx-auto max-w-[1400px]">
          <Rule label="Технические свойства плёнки" num="09" />
          <div className="grid gap-[2px] bg-line md:grid-cols-3">
            {PROPERTIES.map(([t, c], i) => (
              <div key={t} className="bg-obsidian p-10">
                <p className="font-display text-2xl text-ember">{String(i + 1).padStart(2, "0")}</p>
                <h3
                  className="mt-8 font-display text-xl uppercase text-ivory"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {t}
                </h3>
                <p className="mt-6 text-[14.5px] leading-[1.85] text-mute">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COMPARISON ═══════════ */}
      <section className="border-b border-line px-[6vw] py-32">
        <div className="mx-auto max-w-[1100px]">
          <Rule label="UNIQUE PPF в сравнении" num="10" />
          <div className="border border-line">
            <div className="grid grid-cols-3 border-b border-line bg-obsidian px-8 py-6 text-[10px] uppercase tracking-[0.3em] text-mute-2">
              <span>Характеристика</span>
              <span>Обычная PPF</span>
              <span className="text-ember">UNIQUE PPF</span>
            </div>
            {[
              ["Эластичность", "180 %", "320 %"],
              ["Гарантия производителя", "5 лет", "10 лет"],
              ["Самовосстановление", "Есть", "Улучшенное, от 40°C"],
              ["Толщина", "150 мкм", "210 мкм"],
              ["Прозрачность", "98.5 %", "99.7 %"],
              ["Работа без разбора авто", "Частично", "Полностью"],
            ].map(([a, b, c]) => (
              <div
                key={a}
                className="grid grid-cols-3 border-b border-line px-8 py-6 text-[14.5px] text-mute last:border-b-0"
              >
                <span className="text-ivory">{a}</span>
                <span>{b}</span>
                <span className="text-ember">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COVERAGE PACKAGES ═══════════ */}
      <section className="border-t border-line px-[6vw] py-32">
        <div className="mx-auto max-w-[1500px]">
          <Rule label="Пакеты защиты" num="11" />
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2
              className="max-w-[760px] font-display uppercase leading-tight text-ivory"
              style={{ fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "0.04em" }}
            >
              Зоны оклейки
              <br />
              <span className="text-ember">под ваш сценарий.</span>
            </h2>
            <p className="max-w-[380px] text-[13.5px] leading-[1.85] text-mute">
              От защиты фронтальных зон удара до полной оклейки кузова и индивидуальных проектов.
              Точный состав согласуем на диагностике.
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col border p-8 ${
                  p.featured ? "border-ember bg-obsidian-2" : "border-line bg-obsidian"
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-mute-2">{p.tag}</p>
                <h3
                  className={`mt-4 font-display text-2xl uppercase ${
                    p.featured ? "text-ember" : "text-ivory"
                  }`}
                  style={{ letterSpacing: "0.05em" }}
                >
                  {p.name}
                </h3>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-3 text-[13.5px] leading-[1.6] text-mute"
                    >
                      <span className="mt-2 h-px w-4 shrink-0 bg-ember" />
                      {it}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 border-t border-line pt-5 text-[11px] uppercase tracking-[0.28em] text-mute">
                  {p.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="border-t border-line bg-obsidian-2 px-[6vw] py-32">
        <div className="mx-auto max-w-[1000px]">
          <Rule label="Частые вопросы" num="12" />
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7">
                  <span
                    className="font-display text-lg uppercase text-ivory md:text-xl"
                    style={{ letterSpacing: "0.03em" }}
                  >
                    {q}
                  </span>
                  <span className="text-xl text-ember transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-[760px] pb-7 text-[14.5px] leading-[1.9] text-mute">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="px-[6vw] py-32 text-center">
        <h2
          className="mx-auto max-w-[760px] font-display uppercase leading-tight text-ivory"
          style={{ fontSize: "clamp(26px,3.6vw,46px)", letterSpacing: "0.06em" }}
        >
          Защитите свой автомобиль
          <br />
          плёнкой UNIQUE.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/kontakty" className="btn-line btn-ember">
            Рассчитать оклейку
          </Link>
          <Link to="/raboty" className="btn-line">
            Смотреть работы
          </Link>
        </div>
      </section>

      {/* ═══════════ LIGHTBOX ═══════════ */}
      {lightbox !== null && list[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/95 p-6 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`${list[lightbox].brand} ${list[lightbox].model}`}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute left-6 top-6 text-[11px] uppercase tracking-[0.35em] text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            aria-label="Закрыть просмотр"
            autoFocus
          >
            ✕ Закрыть
          </button>
          <button
            type="button"
            className="absolute left-6 top-1/2 -translate-y-1/2 border border-ivory/40 px-4 py-3 text-ivory hover:bg-ivory hover:text-obsidian focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((v) => (v === null ? v : (v - 1 + list.length) % list.length));
            }}
            aria-label="Предыдущий кадр"
          >
            ←
          </button>
          <figure className="max-h-[90vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <img
              key={list[lightbox].img}
              src={list[lightbox].img}
              alt={`${list[lightbox].brand} ${list[lightbox].model} — ${list[lightbox].finish}`}
              className="max-h-[82vh] max-w-[92vw] animate-scale-in object-contain"
            />
            <figcaption className="mt-4 text-center">
              <p
                className="font-display text-xl uppercase text-ivory"
                style={{ letterSpacing: "0.05em" }}
              >
                {list[lightbox].brand} <span className="text-ember">{list[lightbox].model}</span>
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-mute">
                {list[lightbox].finish}
              </p>
            </figcaption>
          </figure>
          <button
            type="button"
            className="absolute right-6 top-1/2 -translate-y-1/2 border border-ivory/40 px-4 py-3 text-ivory hover:bg-ivory hover:text-obsidian focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((v) => (v === null ? v : (v + 1) % list.length));
            }}
            aria-label="Следующий кадр"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
