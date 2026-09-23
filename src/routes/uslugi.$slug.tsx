import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CdnImage } from "@/components/site/CdnImage";
import { LeadForm } from "@/components/site/LeadForm";
import { Rule } from "@/components/site/PageHero";
import { COLOURS } from "@/lib/film-colours";
import { pageSeo } from "@/lib/seo";
import {
  getGroup,
  getService,
  SERVICES,
  servicesInGroup,
  type ExampleShots,
  type Service,
} from "@/lib/services";
import { WORKS } from "@/lib/works";

export const Route = createFileRoute("/uslugi/$slug")({
  loader: ({ params }): { service: Service } => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData, params }) => {
    const s = loaderData?.service;
    if (!s)
      return {
        meta: [
          { title: "Услуга не найдена — UNIQUE Detailing" },
          { name: "robots", content: "noindex" },
        ],
      };
    return pageSeo({
      title: `${s.title} — UNIQUE Detailing`,
      description: `${s.summary} Срок, стоимость, примеры работ и запись онлайн — студия UNIQUE Detailing, Санкт-Петербург.`,
      path: `/uslugi/${params?.slug ?? s.slug}`,
      image: s.img,
      imageAlt: s.title,
    });
  },
  component: ServicePage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-4xl uppercase text-ivory">Услуга не найдена</h1>
        <Link to="/uslugi" className="btn-line mt-8 inline-block">
          Все услуги
        </Link>
      </div>
    </div>
  ),
});

/** Gallery frame indices: exterior 0–5, interior 6–10, detail 11–16. */
const SHOT_INDEX: Record<ExampleShots["shot"], number[]> = {
  exterior: [0, 2, 5],
  interior: [6, 7, 8],
  detail: [11, 12, 13],
};

function exampleWorks(ex: ExampleShots, slug: string) {
  const pool = WORKS.filter((w) => !ex.category || w.category === ex.category);
  const list = pool.length >= 3 ? pool : WORKS;
  // Stable, per-service rotation so different services show different cars.
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const start = h % list.length;
  const idx = SHOT_INDEX[ex.shot];
  return Array.from({ length: Math.min(3, list.length) }, (_, i) => {
    const w = list[(start + i) % list.length];
    return { work: w, img: w.gallery[idx[i % idx.length]] ?? w.hero };
  });
}

function ServicePage() {
  const { service: s } = Route.useLoaderData() as { service: Service };
  const group = getGroup(s.group);
  const siblings = servicesInGroup(s.group).filter((x) => x.slug !== s.slug);
  const examples = exampleWorks(s.examples, s.slug);
  const others = siblings.length ? siblings : SERVICES.filter((x) => x.slug !== s.slug).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden border-b border-line">
        <div className="absolute inset-0 animate-drift">
          <CdnImage
            src={s.img}
            alt={s.title}
            className="h-full w-full object-cover"
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            fallbackWidth={1080}
          />
        </div>
        <div className="absolute inset-0 plate-scrim" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-[6vw] pb-16 pt-36">
          <p className="eyebrow eyebrow-dot mb-6">
            <Link to="/uslugi" className="hover:text-ivory">
              Услуги
            </Link>{" "}
            · {group.title}
          </p>
          <h1
            className="max-w-[1100px] font-display uppercase leading-[1.08] text-ivory"
            style={{ fontSize: "clamp(28px,4.4vw,64px)", letterSpacing: "0.03em" }}
          >
            {s.title}
          </h1>
          <p className="mt-8 max-w-[640px] text-[16px] leading-[1.9] text-mute">{s.summary}</p>
        </div>
      </section>

      {/* ОПИСАНИЕ + СРОК / ЦЕНА */}
      <section className="px-[6vw] py-24 md:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-16 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Rule label="Об услуге" num="01" />
            <div className="space-y-6">
              {s.description.map((p) => (
                <p key={p} className="text-[15.5px] leading-[1.95] text-mute">
                  {p}
                </p>
              ))}
            </div>
            <p className="eyebrow mb-5 mt-12">Что входит</p>
            <ul className="space-y-3">
              {s.includes.map((b) => (
                <li key={b} className="flex gap-4 text-[14.5px] leading-[1.75] text-mute">
                  <span className="mt-3 h-px w-5 flex-shrink-0 bg-ember" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <p className="eyebrow mb-5 mt-12">Уход после услуги</p>
            <p className="max-w-[620px] text-[14.5px] leading-[1.9] text-mute">{s.care}</p>
          </div>

          <aside className="h-fit border border-line bg-obsidian-2 p-8 md:sticky md:top-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-mute-2">Срок</p>
              <p className="mt-2 font-display text-2xl uppercase text-ivory">
                {s.duration ?? "по согласованию"}
              </p>
            </div>
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-mute-2">Стоимость</p>
              <p className="mt-2 font-display text-2xl uppercase text-ember">
                {s.price ?? "рассчитывается после осмотра"}
              </p>
            </div>
            {s.note ? (
              <p className="mt-6 text-[12.5px] leading-[1.7] text-mute-2">{s.note}</p>
            ) : null}
            <p className="mt-6 text-[12.5px] leading-[1.7] text-mute-2">
              Итоговую стоимость и сроки согласуем после осмотра автомобиля и фиксируем в договоре.
            </p>
            <a href="#zapis" className="btn-line btn-ember mt-8 block text-center">
              Записаться
            </a>
          </aside>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="border-t border-line px-[6vw] py-24 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <Rule label="Преимущества" num="02" />
          <div className="grid gap-[2px] bg-line sm:grid-cols-2 lg:grid-cols-4">
            {group.benefits.map((b, i) => (
              <div key={b} className="bg-obsidian p-8">
                <p className="font-display text-2xl text-mute-2">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-5 text-[14px] leading-[1.8] text-mute">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПАЛИТРА (смена цвета) */}
      {s.palette ? (
        <section className="border-t border-line bg-obsidian-2 px-[6vw] py-24 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <Rule label="Палитра" num="03" />
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <h2
                className="max-w-[820px] font-display uppercase leading-tight text-ivory"
                style={{ fontSize: "clamp(26px,3.2vw,46px)", letterSpacing: "0.04em" }}
              >
                Примеры цветов
                <br />
                <span className="text-ember">
                  {s.slug === "smena-cveta-vinil" ? "200+ оттенков и фактур." : "из 180 оттенков."}
                </span>
              </h2>
              <p className="max-w-[420px] text-[13.5px] leading-[1.85] text-mute">
                Ниже — часть палитры. Полный набор образцов покажем в студии: цвет лучше выбирать
                вживую, при дневном свете.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {COLOURS.map((c) => (
                <figure key={c.name} className="group relative overflow-hidden bg-obsidian">
                  <div className="aspect-[4/3]">
                    <img
                      src={c.img}
                      alt={`${c.name} — ${c.type}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 plate-scrim" />
                  <span className="absolute right-3 top-3 border border-ivory/25 bg-obsidian/45 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.26em] text-ivory backdrop-blur-sm">
                    {c.type}
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
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
            <div className="mt-10">
              <Link to="/plenka" className="btn-line">
                Вся коллекция плёнок UNIQUE
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ЭТАПЫ */}
      <section className="border-t border-line px-[6vw] py-24 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <Rule label="Как проходит работа" num={s.palette ? "04" : "03"} />
          <div className="grid gap-[2px] bg-line md:grid-cols-4">
            {group.process.map(([t, c], i) => (
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

      {/* ПРИМЕРЫ РАБОТ */}
      <section className="border-t border-line bg-obsidian-2 px-[6vw] py-24 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <Rule label="Примеры работ" num={s.palette ? "05" : "04"} />
          <div className="grid gap-[2px] bg-line sm:grid-cols-3">
            {examples.map(({ work: w, img }) => (
              <Link
                key={w.slug}
                to="/raboty/$slug"
                params={{ slug: w.slug }}
                className="group relative block overflow-hidden bg-obsidian"
              >
                <div className="aspect-[4/5]">
                  <img
                    src={img}
                    alt={`${w.brand} ${w.model}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 plate-scrim" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-mute">{w.category}</p>
                  <h3
                    className="mt-2 font-display text-xl uppercase leading-tight text-ivory"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {w.brand} {w.model}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/raboty" className="btn-line">
              Все выполненные работы
            </Link>
          </div>
        </div>
      </section>

      {/* ВОПРОСЫ ПО УСЛУГЕ */}
      <section className="border-t border-line px-[6vw] py-24 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <Rule label="Вопросы по услуге" num={s.palette ? "06" : "05"} />
          <div className="divide-y divide-line border-t border-line">
            {s.faq.map(([q, a]) => (
              <details key={q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[15px] uppercase leading-tight text-ivory md:text-[17px]">
                  {q}
                  <span className="shrink-0 font-display text-xl text-mute-2 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[760px] text-[14.5px] leading-[1.9] text-mute">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА ЗАПИСИ */}
      <section className="border-t border-line px-[6vw] py-24 md:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-16 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow mb-4">Запись на услугу</p>
            <h2
              className="font-display uppercase leading-tight text-ivory"
              style={{ fontSize: "clamp(26px,3vw,42px)", letterSpacing: "0.05em" }}
            >
              Рассчитаем стоимость
              <br />
              <span className="text-ember">и согласуем сроки.</span>
            </h2>
            <p className="mt-8 text-[15px] leading-[1.9] text-mute">
              Оставьте заявку — менеджер свяжется с вами, уточнит детали и подберёт удобное время.
              При необходимости заберём автомобиль эвакуатором из любой точки города.
            </p>
            <Link to="/privilegii" className="btn-line mt-8 inline-block">
              Привилегии работы с нами
            </Link>
          </div>
          <LeadForm key={s.slug} defaultService={s.title} heading="Запись на услугу" />
        </div>
      </section>

      {/* ДРУГИЕ УСЛУГИ */}
      <section className="border-t border-line bg-obsidian-2 px-[6vw] py-24">
        <div className="mx-auto max-w-[1280px]">
          <Rule label={`Ещё в разделе «${group.title}»`} />
          <ul className="grid gap-px bg-line md:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug} className="bg-obsidian">
                <Link
                  to="/uslugi/$slug"
                  params={{ slug: o.slug }}
                  className="flex items-center justify-between gap-6 p-6 text-[14.5px] text-mute transition-colors hover:text-ivory"
                >
                  <span>{o.title}</span>
                  <span className="h-px w-8 flex-shrink-0 bg-ember" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link to="/uslugi" className="btn-line">
              Все услуги
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
