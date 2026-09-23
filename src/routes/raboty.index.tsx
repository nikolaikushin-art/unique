import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { WORKS, CATEGORIES } from "@/lib/works";
import { cdnWidth } from "@/lib/cdn";
import { CdnImage } from "@/components/site/CdnImage";
import { pageSeo } from "@/lib/seo";

const RABOTY_HERO = "/portfolio/bentley-continental-gt-speed-0.jpg";

export const Route = createFileRoute("/raboty/")({
  head: () => {
    const seo = pageSeo({
      title: "Работы — UNIQUE Detailing",
      description:
        "Портфолио выполненных работ студии UNIQUE. Оклейка защитной полиуретановой плёнкой (PPF), смена цвета и керамика для Audi, Aston Martin, BMW, Porsche, Bentley и других премиум-автомобилей.",
      path: "/raboty",
      ogDescription: "Больше 500 автомобилей за 10 лет. Портфолио студии UNIQUE.",
      // Branded 1200×630 JPEG — avoid WebP (many messengers ignore it).
    });
    return {
      ...seo,
      links: [
        ...seo.links,
        {
          rel: "preload",
          as: "image",
          href: cdnWidth(RABOTY_HERO, 1440),
          type: "image/webp",
          fetchpriority: "high",
        },
      ],
    };
  },
  component: RabotyPage,
});

function RabotyPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Все работы");
  const list = useMemo(
    () => (cat === "Все работы" ? WORKS : WORKS.filter((w) => w.category === cat)),
    [cat],
  );

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[78vh] items-center overflow-hidden border-b border-line pt-28">
        <div className="absolute inset-0 animate-drift opacity-70">
          <CdnImage
            src={RABOTY_HERO}
            alt="Портфолио UNIQUE Detailing — Bentley Continental GT Speed"
            className="h-full w-full object-cover"
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            fallbackWidth={1440}
          />
        </div>
        <div className="absolute inset-0 plate-scrim" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-[6vw]">
          <p className="eyebrow eyebrow-dot mb-6">Выполненные работы</p>
          <h1
            className="max-w-[1100px] font-display uppercase leading-[1.02] text-ivory"
            style={{ fontSize: "clamp(42px,7vw,108px)", letterSpacing: "0.03em" }}
          >
            Больше пятисот
            <br />
            автомобилей.
            <br />
            Каждый — уникален.
          </h1>
          <p className="mt-8 max-w-[560px] text-[16px] leading-[1.9] text-mute">
            Избранные проекты студии UNIQUE — от полной оклейки суперкаров и люксовых седанов до
            смены цвета плёнкой и керамической защиты. Каждый автомобиль под клубной гарантией.
          </p>
        </div>
      </section>

      {/* ФИЛЬТРЫ */}
      <div className="border-b border-line bg-obsidian-2 px-[6vw]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6 py-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`border px-6 py-3 text-[11px] uppercase tracking-[0.3em] transition-colors ${
                  cat === c
                    ? "border-ivory bg-ivory text-obsidian"
                    : "border-line-strong text-mute hover:text-ivory"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-mute-2">
            {list.length} {list.length === 1 ? "работа" : list.length < 5 ? "работы" : "работ"}
          </span>
        </div>
      </div>

      {/* СЕТКА */}
      <section className="px-[6vw] py-24">
        <div className="mx-auto grid max-w-[1400px] gap-[2px] bg-line sm:grid-cols-2 lg:grid-cols-3">
          {list.map((w, i) => (
            <Link
              key={w.slug}
              to="/raboty/$slug"
              params={{ slug: w.slug }}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-obsidian p-8"
            >
              <CdnImage
                src={w.hero}
                alt={`${w.brand} ${w.model}`}
                className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
              />
              <div className="absolute inset-0 plate-scrim" />
              <div className="absolute left-6 top-6 z-10 text-[10px] uppercase tracking-[0.3em] text-mute">
                {String(i + 1).padStart(2, "0")} · {w.category}
              </div>
              <div className="relative z-10">
                <p className="eyebrow mb-3 text-mute-2">
                  {w.hours} · {w.city}
                </p>
                <h3
                  className="font-display uppercase leading-tight text-ivory"
                  style={{ fontSize: "24px", letterSpacing: "0.06em" }}
                >
                  {w.brand}
                </h3>
                <p className="mt-1 text-[15px] text-ivory">{w.model}</p>
                <p className="mt-3 max-w-[300px] text-[13px] leading-[1.7] text-mute line-clamp-2">
                  {w.tagline}
                </p>
                <span className="link-more mt-5">Подробнее</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
