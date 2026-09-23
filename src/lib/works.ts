// UNIQUE Detailing — portfolio data
// Each portfolio entry uses a dedicated photo set generated for that exact
// vehicle (brand, model, body, paint), stored under /public/portfolio and
// keyed by slug, so every card and detail page matches its label.
import { cdn } from "./cdn";
import { storyFor } from "./project-stories";
import { REAL_PORTFOLIO } from "./real-portfolio";
import { STUDIO_VEHICLES, type StudioVehicle } from "./studio-vehicles";

export type Spec = { label: string; value: string };
export type Bespoke = { title: string; note: string; options: string[] };

export type Work = {
  slug: string;
  brand: string;
  model: string;
  category: "PPF" | "Смена цвета" | "Керамика" | "Восстановление";
  tagline: string;
  hours: string;
  film: string;
  duration: string;
  story: string[];
  quote: string;
  hero: string;
  gallery: string[];
  works: string[];
  materials: { name: string; note: string }[];
  faqs: { q: string; a: string }[];
  year: number;
  city: string;
  variant: 0 | 1 | 2 | 3;
  specs: Spec[];
  performance: { power: string; torque: string; zeroTo: string; top: string; weight: string };
  bespoke: Bespoke[];
  palette: { name: string; hex: string; note: string }[];
};

const BODY_LABEL: Record<StudioVehicle["body"], string> = {
  coupe: "купе",
  convertible: "кабриолет",
  sedan: "седан",
  suv: "внедорожник",
  wagon: "универсал",
  supercar: "суперкар",
  hypercar: "гиперкар",
};

/** Stable hash so each slug gets a fixed, unique narrative pick. */
function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickOne<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/**
 * Build a unique 3-paragraph case study per vehicle.
 * Category + paint + body + hours + film make each history distinct —
 * no shared template triple across the portfolio.
 */
function buildStory(v: StudioVehicle, film: string): string[] {
  const h = hashSlug(v.slug);
  const body = BODY_LABEL[v.body];
  const car = `${v.brand} ${v.model}`;
  const paint = v.paintName;

  const objectives: Record<StudioVehicle["category"], string[]> = {
    PPF: [
      `${car} ${v.year} года поступил в студию как ${body} с заводским цветом ${paint}: задача — полная прозрачная защита кузова без изменения облика.`,
      `Владелец ${car} просил сохранить глубину ${paint} на годы вперёд — ${body} готовился к ежедневной эксплуатации по петербургским дорогам.`,
      `Для ${car} в цвете ${paint} нужна была невидимая броня: сколы, реагенты и ультрафиолет не должны были коснуться заводского лака.`,
      `${car} приехал почти новым. Цель по ${paint} звучала прямо: оклеить кузов до первой зимы и снять тревогу о состоянии покрытия.`,
      `Проект по ${car} начался с одной установки — защитить ${body} в ${paint}, не разбирая оптику и не трогая заводские панели.`,
    ],
    "Смена цвета": [
      `${car} заехал на смену цвета: заводской ${paint} остаётся под плёнкой, а снаружи — новый характер без вмешательства в лак.`,
      `Владелец ${car} хотел обновить облик ${body}, сохранив возможность вернуть ${paint} в любой момент — обратимо и безопасно.`,
      `Задача по ${car} ${v.year} года — цветовая трансформация поверх ${paint}: новый тон, прежняя геометрия кузова, без перекраса.`,
      `${car} в ${paint} получил бриф на смену цвета полиуретаном: матовый или глянцевый эффект без потери линий ${body}.`,
      `Для ${car} смена цвета стала способом обновить образ: ${paint} прячется под плёнкой, кузов остаётся целым.`,
    ],
    Керамика: [
      `${car} поступил на керамическую защиту: усилить глубину ${paint}, закрыть кузов, диски и стёкла гидрофобным слоем 9H.`,
      `Владелец ${car} просил «мокрый» блеск ${paint} и лёгкий уход — керамика на ${body} без оклейки всего кузова.`,
      `Проект ${car} ${v.year} года — керамика поверх подготовленного лака ${paint}: гидрофоб, цвет и защита от химии.`,
      `${car} в ${paint} нуждался в тонкой, но стойкой защите: керамическое покрытие кузова, дисков и оптики.`,
      `Для ${body} ${car} выбрали керамический маршрут — сохранить ${paint} и упростить мойку на годы.`,
    ],
    Восстановление: [
      `${car} приехал на комплекс восстановления: вернуть ${paint} к зеркальной глубине и сразу закрыть результат защитой.`,
      `На ${car} накопились следы эксплуатации — задача по ${paint}: полировка, коррекция и финальная защита ${body}.`,
      `Владелец ${car} хотел «как с завода»: убрать голограммы с ${paint}, затем закрепить результат плёнкой или керамикой.`,
      `${car} ${v.year} года прошёл путь восстановления ЛКП — от диагностики под светом до защиты восстановленного ${paint}.`,
      `Проект по ${car}: вернуть глубину ${paint} после пробега и зафиксировать кузов защитным слоем под клубной программой.`,
    ],
  };

  const solutions: Record<StudioVehicle["category"], string[]> = {
    PPF: [
      `За ${v.hours} мастера уложили ${film} по кузову ${car} без разбора: капот, зоны удара, пороги и арки закрыты сплошным полотном, кромки заведены под панели.`,
      `Кузов ${car} подготовили и оклеили ${film} вручную — плёнка повторила геометрию ${body} и полностью сохранила оттенок ${paint}.`,
      `${film} раскроили по месту на ${car}: без снятия оптики и молдингов, с заводом под кромки там, где ${paint} рискует первым.`,
      `На ${car} легла ${film} — прозрачная защита поверх ${paint}, уложенная за ${v.hours} с контролем каждого шва под направленным светом.`,
      `Технология без разбора на ${car}: ${film} закрыла кузов целиком, оставив ${paint} нетронутым под невидимым слоем.`,
    ],
    "Смена цвета": [
      `За ${v.hours} кузов ${car} оклеили цветовой плёнкой ${film} поверх ${paint}: новый тон, обратимый съём, кромки без демонтажа панелей.`,
      `На ${car} выполнили смену цвета материалом ${film} — ${body} получил новый характер, заводской ${paint} остался целым под плёнкой.`,
      `${film} легла на ${car} сплошным цветовым полотном: стыки сведены в тень линий кузова, ${paint} законсервирован.`,
      `Цветовой проект ${car} занял ${v.hours}: раскрой ${film}, укладка без разбора и контроль глубины нового покрытия над ${paint}.`,
      `Мастера UNIQUE нанесли ${film} на ${car}, сохранив геометрию ${body} и возможность вернуть ${paint} при снятии плёнки.`,
    ],
    Керамика: [
      `После подготовки лака ${paint} на ${car} нанесли ${film}: кузов, диски и стёкла получили кристаллический слой с гидрофобным эффектом.`,
      `Комплекс по ${car} занял ${v.hours} — деконтаминация, полировка и ${film} на ${paint} для глубины цвета и стойкости к химии.`,
      `На ${car} легла керамика ${film}: ${body} в ${paint} получил «мокрый» блеск и защиту без полной оклейки кузова.`,
      `${film} закрепили на подготовленном ${paint} автомобиля ${car} — отдельно проработали диски, оптику и контактные зоны.`,
      `Керамический слой ${film} на ${car} усилил глубину ${paint} и закрыл поверхности, которые чаще всего страдают от реагентов.`,
    ],
    Восстановление: [
      `Сначала ${paint} на ${car} вывели многоступенчатой полировкой под контрольным светом, затем закрепили результат материалом ${film}.`,
      `Комплекс по ${car} занял ${v.hours}: коррекция ЛКП, удаление голограмм с ${paint} и финальная защита ${film} без разбора ${body}.`,
      `На ${car} совместили восстановление и защиту — полировка вернула глубину ${paint}, ${film} зафиксировала результат.`,
      `После диагностики кузова ${car} прошёл коррекцию ${paint} и получил ${film} на зоны риска и основные панели.`,
      `Мастера вернули ${paint} на ${car} к состоянию «как новое», затем закрыли кузов ${film} под клубной гарантией.`,
    ],
  };

  const results: Record<StudioVehicle["category"], string[]> = {
    PPF: [
      `${car} ушёл из студии с невидимой защитой поверх ${paint}: сколы и реагенты принимает ${film}, гарантия UNIQUE — 10 лет.`,
      `Итог по ${car}: ${body} в ${paint} выглядит заводским, а под плёнкой кузов закрыт на годы ежедневной эксплуатации.`,
      `Финальная инспекция ${car} подтвердила чистоту кромок — ${paint} сохранён, защита работает там, где лак повреждается первым.`,
      `Теперь ${car} (${v.performance.power}) можно эксплуатировать без оглядки на петербургские дороги: ${paint} под ${film} в безопасности.`,
      `${car} вернулся владельцу таким, каким его любили — только ${paint} теперь прикрыт прозрачной бронёй UNIQUE.`,
    ],
    "Смена цвета": [
      `${car} получил новый образ поверх сохранённого ${paint}: смена цвета обратима, кузов ${body} защищён свойствами PPF.`,
      `Итог проекта ${car}: свежий цвет, целый заводской ${paint} под плёнкой и клубная гарантия на материал ${film}.`,
      `${car} покинул студию в новом оттенке — геометрия ${body} читается чисто, ${paint} законсервирован до возможного возврата.`,
      `Владелец ${car} получил и стиль, и защиту: цветовая плёнка держит удары, а ${paint} остаётся нетронутым.`,
      `Финальный свет на ${car} показал ровный цвет и чистые кромки — смена цвета поверх ${paint} выполнена без компромиссов.`,
    ],
    Керамика: [
      `${car} выехал с гидрофобным эффектом на ${paint}: вода скатывается, цвет глубже, уход проще — под гарантией до 5 лет.`,
      `Итог по ${car}: керамика ${film} усилила ${paint}, закрыла диски и стёкла, сохранив характер ${body}.`,
      `${paint} на ${car} заиграл глубже после керамики — поверхность готова к реагентам и частым мойкам без потери блеска.`,
      `Финальная проверка ${car} подтвердила равномерный слой ${film} и стойкий блеск ${paint} на всём кузове.`,
      `${car} вернулся в город с защищённым ${paint}: керамика держит чистоту дольше, а вид остаётся клубным.`,
    ],
    Восстановление: [
      `${car} вышел с восстановленным ${paint} и закреплённой защитой ${film} — кузов снова выглядит цельным и глубоким.`,
      `Итог комплекса на ${car}: голограммы убраны, ${paint} зеркальный, ${body} закрыт защитой под программой UNIQUE.`,
      `После ${v.hours} работы ${car} снова готов к дороге — восстановленный ${paint} и финальный слой ${film} прошли инспекцию.`,
      `Владелец ${car} получил результат «как новый»: коррекция ${paint} и защита, рассчитанная на реальную эксплуатацию.`,
      `Финальный свет на ${car} не оставил спорных зон — ${paint} восстановлен, защита легла ровно по всему кузову.`,
    ],
  };

  // Independent seeds per paragraph — avoids the old period-4 template lockstep.
  return [
    pickOne(objectives[v.category], h),
    pickOne(solutions[v.category], (h >>> 7) + v.year * 3),
    pickOne(results[v.category], (h >>> 13) + v.hours.length * 11 + paint.length),
  ];
}

const QUOTES = [
  "Лучшая защита незаметна — виден только безупречный автомобиль.",
  "Мы сохраняем то, за что владелец полюбил свою машину.",
  "Идеальная работа с плёнкой — та, которую невозможно разглядеть.",
  "Каждый шов кладётся так, будто его не существует.",
  "Цвет можно сменить. Заводской лак — только сохранить.",
  "Керамика не кричит о себе — о ней говорит глубина лака.",
  "Сначала вернуть покрытие. Потом — защитить результат.",
  "Клубный стандарт начинается с уважения к конкретному автомобилю.",
];

const WORKS_POOL = [
  "Диагностика лакокрасочного покрытия под направленным светом",
  "Мойка в чистой зоне и полная деконтаминация кузова",
  "Мягкая полировка и удаление вихревых царапин перед оклейкой",
  "Ручной раскрой плёнки UNIQUE PPF с заводом под кромки без разбора",
  "Полная оклейка кузова с защитой зон удара, порогов и арок",
  "Отдельная защита оптики и лобового стекла от щебня и реагентов",
  "Интерьерная защита кожи, алькантары и декоративных вставок",
  "Керамическое покрытие кузова, дисков и оптики после инспекции",
];

const MATERIALS_POOL = [
  {
    name: "UNIQUE PPF Clear",
    note: "Прозрачная полиуретановая плёнка с самовосстановлением и глубиной заводского лака.",
  },
  {
    name: "UNIQUE PPF Satin",
    note: "Сатиновая плёнка для тихого матового эффекта без потери читаемости формы кузова.",
  },
  {
    name: "Ceramic Pro 9H",
    note: "Керамика поверх плёнки: гидрофобность, глубина цвета и защита от химии.",
  },
  {
    name: "UNIQUE Interior Coat",
    note: "Защитный состав для кожи и алькантары, сохраняющий фактуру салона.",
  },
  {
    name: "Wheel Ceramic",
    note: "Термостойкая керамика для дисков и суппортов, отталкивающая тормозную пыль.",
  },
  {
    name: "Glass Repellent",
    note: "Гидрофоб для стёкол и камер, улучшающий обзор в дождь и снег.",
  },
];

const FAQS_POOL = [
  {
    q: "Заметна ли плёнка на кузове?",
    a: "Нет. Глянцевая плёнка оптически прозрачна, повторяет глубину лака, а кромки заводятся под панели — переходов не видно даже вблизи.",
  },
  {
    q: "Сколько занимает оклейка?",
    a: "От 2–3 дней для фронтальной зоны до 7–10 дней для полного кузова. Точный срок зависит от модели и состояния покрытия.",
  },
  {
    q: "Нужно ли разбирать автомобиль?",
    a: "Нет. Мы работаем без снятия оптики, ручек и эмблем — плёнка укладывается по месту с заводом под кромки.",
  },
  {
    q: "Как ухаживать за автомобилем после защиты?",
    a: "Достаточно обычной бесконтактной мойки. Мелкие царапины на плёнке затягиваются при нагреве, а раз в год мы бесплатно проверяем покрытие.",
  },
  {
    q: "Можно ли снять плёнку без вреда для лака?",
    a: "Да. Клеевой слой paint-safe: плёнка снимается без остатков клея и следов на заводском лакокрасочном покрытии.",
  },
  {
    q: "Какая гарантия на защиту?",
    a: "10 лет на плёнку UNIQUE PPF — против пожелтения, отслоения, помутнения и потери самовосстановления.",
  },
];

const BESPOKE_TEMPLATES: Bespoke[] = [
  {
    title: "Плёнка кузова",
    note: "Выбор фактуры и глубины защиты — от прозрачной до сатиновой.",
    options: [
      "UNIQUE PPF Clear",
      "UNIQUE PPF Satin",
      "UNIQUE PPF Matte",
      "UNIQUE PPF Colour Shift",
    ],
  },
  {
    title: "Керамика поверх",
    note: "Дополнительный слой 9H поверх плёнки — гидрофобность и глубина.",
    options: [
      "Без керамики",
      "Ceramic Pro 9H — 5 слоёв",
      "Ceramic Pro 9H — 9 слоёв",
      "UNIQUE Diamond Coat",
    ],
  },
  {
    title: "Салон",
    note: "Защита кожи, алькантары и декоративных вставок салона.",
    options: [
      "UNIQUE Interior Coat",
      "Дерево + отдельная защита",
      "Алькантара + гидрофоб",
      "Полный клубный пакет",
    ],
  },
  {
    title: "Колёсные диски",
    note: "Термостойкая керамика для дисков и суппортов.",
    options: [
      "Wheel Ceramic 9H",
      "Керамика + суппорта",
      "Полный пакет: диски + арки",
      "Отказаться",
    ],
  },
  {
    title: "Оптика и стёкла",
    note: "Отдельная защита оптики и гидрофоб на лобовое стекло.",
    options: ["Плёнка на оптику", "Гидрофоб на стёкла", "Плёнка + гидрофоб", "Только лобовое"],
  },
  {
    title: "Клубный пакет",
    note: "Уровень включения в клубную программу UNIQUE.",
    options: [
      "Silver — ежегодная ревизия",
      "Gold — приоритетный менеджер",
      "Platinum — выездной сервис",
      "Founders — доступ ко всем событиям",
    ],
  },
];

const pick = <T>(arr: T[], index: number, count: number): T[] =>
  Array.from({ length: count }, (_, offset) => arr[(index * 2 + offset) % arr.length]);

function filmFor(vehicle: StudioVehicle, i: number): string {
  const h = hashSlug(vehicle.slug) + i;
  switch (vehicle.category) {
    case "PPF":
      return pickOne(["UNIQUE PPF Clear", "UNIQUE PPF Satin", "UNIQUE PPF Clear + Ceramic"], h);
    case "Смена цвета":
      return pickOne(
        ["UNIQUE PPF Colour", "UNIQUE PPF Satin Colour", "UNIQUE PPF Colour Shift"],
        h,
      );
    case "Керамика":
      return pickOne(["Ceramic Pro 9H", "UNIQUE Diamond Coat", "Ceramic Pro 9H — 9 слоёв"], h);
    case "Восстановление":
      return pickOne(["UNIQUE PPF Clear + Ceramic", "UNIQUE PPF Clear", "Ceramic Pro 9H"], h);
  }
}

export const WORKS: Work[] = STUDIO_VEHICLES.map((vehicle, i) => {
  const real = REAL_PORTFOLIO[vehicle.slug];
  const film = real?.film ?? filmFor(vehicle, i);
  // Per-vehicle photo set: 0 = hero/front 3/4, 1 = rear 3/4, 2 = interior, 3 = detail.
  const shot = (n: 0 | 1 | 2 | 3) => cdn(`/portfolio/${vehicle.slug}-${n}.jpg`);
  // Three extra unique exterior angles (front-on, side profile, elevated rear 3/4).
  const ext = (n: 1 | 2 | 3) => cdn(`/portfolio/${vehicle.slug}-ext-${n}.jpg`);
  // Six distinct interiors per car (original + 5 unique angles), no repeats.
  const interior = (n: 1 | 2 | 3 | 4 | 5) => cdn(`/portfolio/${vehicle.slug}-int-${n}.jpg`);
  // Six unique detail close-ups (wheel/caliper, headlight, grille/badge, mirror/PPF, exhaust, taillight).
  const detail = (n: 1 | 2 | 3 | 4 | 5 | 6) => cdn(`/portfolio/${vehicle.slug}-det-${n}.jpg`);
  // Six craftsmanship stages: prep, wash, correction, PPF, coating, inspection.
  const craft = (n: 1 | 2 | 3 | 4 | 5 | 6) => cdn(`/portfolio/${vehicle.slug}-craft-${n}.jpg`);
  const gallery = real?.gallery.map(cdn) ?? [
    // 0–5 exterior (6 distinct angles, no repeats)
    shot(0),
    shot(1),
    ext(1),
    ext(2),
    ext(3),
    shot(3),
    // 6–10 interior (5 purpose-shot angles). The core "-2" interior is
    // intentionally omitted here: it reuses the same front-cabin framing as
    // one of the int-* shots, which produced a duplicate / colour-mismatched
    // second tile on many cars.
    interior(1),
    interior(2),
    interior(3),
    interior(4),
    interior(5),
    // 11–16 detail (6 unique close-ups)
    detail(1),
    detail(2),
    detail(3),
    detail(4),
    detail(5),
    detail(6),
    // 17–22 craft (6 unique detailing stages)
    craft(1),
    craft(2),
    craft(3),
    craft(4),
    craft(5),
    craft(6),
  ];
  const specs: Spec[] = [
    { label: "Мощность", value: vehicle.performance.power },
    { label: "Крутящий", value: vehicle.performance.torque },
    { label: "0–100 км/ч", value: vehicle.performance.zeroTo },
    { label: "Максимум", value: vehicle.performance.top },
    { label: "Снаряжённая масса", value: vehicle.performance.weight },
    { label: "Кузов", value: vehicle.body },
    { label: "Цвет", value: vehicle.paintName },
    { label: "Гарантия", value: "10 лет клубной программы" },
  ];

  return {
    slug: vehicle.slug,
    brand: vehicle.brand,
    model: vehicle.model,
    category: vehicle.category,
    tagline: vehicle.tagline,
    hours: vehicle.hours,
    film,
    duration:
      real?.duration ?? ["5 дней", "7 дней", "9 дней", "11 дней", "14 дней", "18 дней"][i % 6],
    story: real?.story ?? storyFor(vehicle.slug) ?? buildStory(vehicle, film),
    quote: real?.quote ?? QUOTES[(hashSlug(vehicle.slug) + i) % QUOTES.length],
    hero: gallery[0] ?? shot(0),
    gallery,
    works: real?.works ?? pick(WORKS_POOL, i, 6),
    materials: real?.materials ?? pick(MATERIALS_POOL, i, 4),
    faqs: real?.faqs ?? pick(FAQS_POOL, i, 4),
    year: vehicle.year,
    city: "Санкт-Петербург",
    variant: (i % 4) as 0 | 1 | 2 | 3,
    specs,
    performance: vehicle.performance,
    bespoke: pick(BESPOKE_TEMPLATES, i, 4),
    palette: [
      {
        name: vehicle.paintName,
        hex: vehicle.paint,
        note: `Заводской цвет кузова ${vehicle.brand} ${vehicle.model}, сохранённый под защитной плёнкой.`,
      },
      { name: "Салон", hex: vehicle.interior, note: "Оттенок кожи и отделки салона автомобиля." },
      {
        name: "Диски",
        hex: vehicle.wheel,
        note: "Отделка колёсных дисков под керамической защитой.",
      },
    ],
  };
});

export const getWork = (slug: string) => WORKS.find((work) => work.slug === slug);

export const relatedWorks = (slug: string, n = 3) => {
  const current = getWork(slug);
  const sameBrand = WORKS.filter((work) => work.slug !== slug && work.brand === current?.brand);
  const sameCategory = WORKS.filter(
    (work) =>
      work.slug !== slug && work.category === current?.category && work.brand !== current?.brand,
  );
  const rest = WORKS.filter(
    (work) => work.slug !== slug && !sameBrand.includes(work) && !sameCategory.includes(work),
  );
  return [...sameBrand, ...sameCategory, ...rest].slice(0, n);
};

export const CATEGORIES = [
  "Все работы",
  "PPF",
  "Смена цвета",
  "Керамика",
  "Восстановление",
] as const;
