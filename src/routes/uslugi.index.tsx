import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageHero, Rule } from "@/components/site/PageHero";
import { cdn } from "@/lib/cdn";

import { pageSeo } from "@/lib/seo";
import { SERVICE_GROUPS, servicesInGroup } from "@/lib/services";

export const Route = createFileRoute("/uslugi/")({
  head: () =>
    pageSeo({
      title: "Услуги — UNIQUE Detailing",
      description:
        "Оклейка защитной полиуретановой плёнкой (PPF), смена цвета плёнкой, керамика, восстановление ЛКП. Работа без разбора автомобиля по европейскому стандарту.",
      path: "/uslugi",
      ogDescription: "PPF, керамика, смена цвета и восстановление ЛКП в студии UNIQUE.",
    }),
  component: UslugiPage,
});

const SERVICES = [
  {
    id: "ppf",
    page: "ppf-unique-protection",
    num: "01",
    title: "Полная и зональная оклейка защитной полиуретановой плёнкой (PPF) без разбора авто",
    copy: "Надёжная защита кузова автомобиля полиуретановой плёнкой от сколов, царапин, реагентов, песка и других повреждений на дороге. Плёнка сохраняет заводской блеск лакокрасочного покрытия, предотвращает выгорание и помогает поддерживать автомобиль в идеальном состоянии.",
    bullets: [
      "Максимальная защита кузова от сколов и царапин.",
      "Сохранение заводского вида на годы.",
      "Работа без разбора — оптика, ручки, эмблемы остаются на месте.",
      "Гарантия на плёнку UNIQUE PPF — 10 лет.",
    ],
    duration: "5 – 10 дней",
    from: "от 180 000 ₽",
    // Professional wet-apply PPF install — not wash/foam.
    img: cdn("/ppf/ppf-install-apply.jpg"),
  },
  {
    id: "color",
    page: "smena-cveta-poliuretan",
    num: "02",
    title: "Смена цвета плёнкой без разбора авто — полиуретан или винил",
    copy: "Полная смена цвета кузова обратимо и безопасно, без вмешательства в заводскую окраску. Две опции материала на выбор: полиуретановая плёнка UNIQUE Protection (180 цветов) с дополнительными защитными свойствами PPF, либо виниловая плёнка (200+ цветов) для более широкой палитры оттенков и фактур.",
    bullets: [
      "Полиуретан UNIQUE Protection — 180 цветов, двойная защита: цвет + свойства PPF.",
      "Винил — 200+ цветов, глянец, мат, сатин, хамелеоны и текстуры.",
      "Возможность вернуть заводской цвет в любой момент.",
      "Эксклюзивные оттенки, разработанные центром UNIQUE.",
    ],
    duration: "10 – 14 дней",
    from: "от 320 000 ₽",
    // Finished colour-change polyurethane wrap (iridescent finish).
    img: cdn("/ppf/ppf-special.jpg"),
  },
  {
    id: "vinylografiya",
    page: "stilevaya-vinilografiya",
    num: "03",
    title: "Стилевая винилография — индивидуальный дизайн-проект",
    copy: "Процесс создания уникального визуального образа автомобиля с помощью печати на виниловой плёнке. В отличие от классической аэрографии краской, винилография позволяет воплотить абсолютно любой цифровой макет, защищает кузов и легко демонтируется при необходимости.",
    bullets: [
      "Выбор концепции и разработка макета в специализированном редакторе с учётом геометрии кузова конкретного автомобиля.",
      "Личное участие клиента в разработке стиля и дизайна — прорабатываем макет на месте, в студии.",
      "Печать дизайн-проекта на виниловой плёнке.",
      "Оклейка автомобиля готовым дизайном.",
    ],
    duration: "по согласованию",
    from: "по расчёту проекта",
    img: cdn("/ppf/ppf-hydrophobic.jpg"),
  },
  {
    id: "ceramic",
    page: "keramika",
    num: "04",
    title: "Керамическая защита кузова, дисков и стёкол",
    copy: "Керамическое покрытие 9H создаёт кристаллическую защитную плёнку на лакокрасочном покрытии. Может использоваться самостоятельно или поверх PPF для двойной защиты и гидрофобного эффекта.",
    bullets: [
      "Защита кузова, колёсных дисков, стёкол и салонной кожи.",
      "Гидрофобный эффект — вода скатывается, грязь не пристаёт.",
      "Гарантия сохранения свойств до 5 лет.",
      "Углублённая цветопередача лака.",
    ],
    duration: "2 – 3 дня",
    from: "от 90 000 ₽",
    // Hydrophobic beading / sheeting — ceramic result, not PPF install.
    img: cdn("/ppf/ppf-hydrophobic.jpg"),
  },
  {
    id: "restore",
    page: "polirovka-kuzova",
    num: "05",
    title: "Комплекс «Восстановление + защита»",
    copy: "Многоступенчатая полировка лакокрасочного покрытия — устранение царапин, голограмм, потёртостей и следов эксплуатации. Финальная защита плёнкой PPF или керамикой на выбор.",
    bullets: [
      "Восстановление ЛКП до состояния «как новое».",
      "Индивидуальный подбор дальнейшей защиты.",
      "Работа под тремя источниками контрольного света.",
      "Идеально после аренды или перед продажей.",
    ],
    duration: "4 – 7 дней",
    from: "от 140 000 ₽",
    // Paint correction inspection under control light.
    img: cdn("/ppf/ppf-install-inspect.jpg"),
  },
  {
    id: "tint",
    page: "tonirovanie-i-okleyka-optiki",
    num: "06",
    title: "Тонирование стёкол и оклейка оптики",
    copy: "Профессиональное тонирование стёкол премиум-плёнками с сертификатами. Прозрачная защита фар и задних фонарей от сколов и помутнения.",
    bullets: [
      "Атермальные и премиум-плёнки в наличии.",
      "Оклейка оптики UNIQUE PPF Clear.",
      "Соответствие требованиям светопропускания.",
    ],
    duration: "1 – 2 дня",
    from: "от 25 000 ₽",
    img: cdn("/portfolio/aston-martin-dbs-770-ultimate-det-2.jpg"),
  },
  {
    id: "interior",
    page: "himchistka",
    num: "07",
    title: "Детейлинг салона и химчистка",
    copy: "Глубокая химчистка кожи, алькантары, ткани и потолка. Восстановление боковых валиков сидений и защитное покрытие салонной кожи.",
    bullets: [
      "Ручная химчистка без агрессивной химии.",
      "Восстановление вытертых зон кожи.",
      "Защитное покрытие UNIQUE Interior Coat.",
    ],
    duration: "2 – 4 дня",
    from: "от 45 000 ₽",
    img: cdn("/portfolio/bentley-flying-spur-mulliner-2.jpg"),
  },
];

function UslugiPage() {
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    // Wait a frame so layout/hero settle before scrolling from footer / deep links.
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <div>
      <PageHero
        eyebrow="Услуги центра"
        title={
          <>
            Семь направлений.
            <br />
            Один стандарт качества.
          </>
        }
        lede="Мы работаем по единым технологическим картам, отработанным в европейском центре UNIQUE. Каждая услуга — с гарантией, договором и клубной книгой владельца."
        image={cdn("/portfolio/mclaren-765lt-0.jpg")}
      />

      {/* УСЛУГИ — чередующиеся блоки */}
      <section className="px-[6vw] py-32">
        <div className="mx-auto max-w-[1400px] space-y-20 md:space-y-32">
          {SERVICES.map((s, i) => (
            <article
              key={s.num}
              id={s.id}
              className={`scroll-mt-28 grid gap-16 md:grid-cols-2 md:items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-obsidian">
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover"
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="absolute inset-0 plate-scrim" />
                <p className="absolute bottom-6 left-6 font-display text-6xl text-ivory opacity-90">
                  {s.num}
                </p>
              </div>
              <div>
                <p className="eyebrow mb-6">Услуга · {s.num}</p>
                <h2
                  className="font-display uppercase leading-tight text-ivory"
                  style={{ fontSize: "clamp(24px,2.6vw,36px)", letterSpacing: "0.05em" }}
                >
                  {s.title}
                </h2>
                <p className="mt-8 text-[15.5px] leading-[1.95] text-mute">{s.copy}</p>
                <ul className="mt-8 space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-4 text-[14.5px] text-mute">
                      <span className="mt-2 h-px w-5 flex-shrink-0 bg-ember" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-line pt-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-mute-2">Срок</p>
                    <p className="mt-2 font-display text-xl uppercase text-ivory">{s.duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-mute-2">Стоимость</p>
                    <p className="mt-2 font-display text-xl uppercase text-ember">{s.from}</p>
                  </div>
                  <div className="ml-auto flex flex-wrap items-center gap-3">
                    {s.page ? (
                      <Link to="/uslugi/$slug" params={{ slug: s.page }} className="btn-line">
                        Подробнее
                      </Link>
                    ) : null}
                    <Link to="/kontakty" className="btn-line btn-ember">
                      Записаться
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ЭТАПЫ РАБОТЫ */}
      <section className="bg-obsidian-2 px-[6vw] py-32">
        <div className="mx-auto max-w-[1280px]">
          <Rule label="Как проходит работа" num="08" />
          <div className="grid gap-[2px] bg-line md:grid-cols-4">
            {[
              [
                "Диагностика",
                "Осмотр под контрольным светом, замеры толщины ЛКП, согласование сроков и стоимости.",
              ],
              [
                "Подготовка",
                "Многочасовая мойка, деконтаминация, глиняная обработка, мягкая полировка кузова.",
              ],
              [
                "Оклейка",
                "Ручной раскрой плёнки UNIQUE без выкроек, укладка без разбора автомобиля, прогрев швов.",
              ],
              [
                "Контроль",
                "Проверка под тремя источниками света, выдача клубной книги и гарантийного сертификата.",
              ],
            ].map(([t, c], i) => (
              <div key={t} className="bg-obsidian p-10">
                <p className="font-display text-2xl text-mute-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className="mt-8 font-display text-2xl uppercase leading-tight text-ivory"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {t}
                </h3>
                <p className="mt-6 text-[14px] leading-[1.85] text-mute">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПОЛНЫЙ ПЕРЕЧЕНЬ УСЛУГ */}
      <section className="border-t border-line px-[6vw] py-32">
        <div className="mx-auto max-w-[1280px]">
          <Rule label="Полный перечень услуг" num="09" />
          <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_GROUPS.map((g) => (
              <div key={g.id} className="bg-obsidian p-8">
                <h3
                  className="font-display text-lg uppercase leading-tight text-ivory"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {g.title}
                </h3>
                <ul className="mt-5 space-y-2">
                  {servicesInGroup(g.id).map((it) => (
                    <li key={it.slug} className="flex gap-3 text-[13.5px] leading-[1.7]">
                      <span className="mt-2 h-px w-3 flex-shrink-0 bg-ember" />
                      <Link
                        to="/uslugi/$slug"
                        params={{ slug: it.slug }}
                        className="text-mute transition-colors hover:text-ivory"
                      >
                        {it.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[720px] text-[13px] leading-[1.8] text-mute-2">
            Каждая услуга — на отдельной странице со сроками, стоимостью, примерами работ и формой
            записи. Отдельные комплекты услуг доступны в формате единого пакета — см.{" "}
            <Link
              to="/kompleksy"
              className="text-mute underline-offset-2 hover:text-ivory hover:underline"
            >
              «Комплексы услуг»
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line px-[6vw] py-32 text-center">
        <h2
          className="mx-auto max-w-[720px] font-display uppercase leading-tight text-ivory"
          style={{ fontSize: "clamp(26px,3.6vw,44px)", letterSpacing: "0.06em" }}
        >
          Готовы рассчитать стоимость?
        </h2>
        <div className="mt-10">
          <Link to="/kontakty" className="btn-line btn-ember">
            Оставить заявку
          </Link>
        </div>
      </section>
    </div>
  );
}
