import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { WORKS } from "@/lib/works";
import heroVideo from "@/assets/hero.mov.asset.json";
import { cdnSized, cdnSrcSet, cdnWidth } from "@/lib/cdn";
import { CdnImage } from "@/components/site/CdnImage";
import { REVIEWS } from "@/lib/reviews";
import { pageSeo } from "@/lib/seo";

// Unique, curated imagery for the home page (no image is reused elsewhere).
const HOME = {
  // Darkened frame from the stolen uniquedetailing.ru hero reel.
  heroPosterPath: "/media/hero-poster.jpg",
  heroPoster: cdnSized("/media/hero-poster.jpg", 1440),
  heroPosterMobile: cdnWidth("/media/hero-poster.jpg", 768),
  studio: "/portfolio/rolls-royce-phantom-series-ii-craft-1.jpg",
  // Shared services visual — PPF install craft (matches core offering).
  services: "/ppf/ppf-install-apply.jpg",
  film: "/portfolio/lamborghini-revuelto-craft-2.jpg",
  quote: cdnSized("/portfolio/ferrari-roma-det-6.jpg", 1080),
};

export const Route = createFileRoute("/")({
  head: () => {
    const seo = pageSeo({
      title: "UNIQUE Detailing — Европейский стандарт детейлинга и оклейки защитной плёнкой (PPF)",
      description:
        "Премиальная детейлинг-студия UNIQUE в Санкт-Петербурге. Оклейка защитной полиуретановой плёнкой (PPF) без разбора автомобиля, собственная плёнка Unique, керамика и клубный сервис. Более 10 лет опыта.",
      path: "/",
      ogTitle: "UNIQUE Detailing — Европейский стандарт",
      ogDescription:
        "Оклейка защитной полиуретановой плёнкой (PPF), керамика и клубный сервис UNIQUE в Санкт-Петербурге. Запись открыта.",
      // Dedicated 1200×630 JPEG share card (not WebP hero) for WhatsApp/Telegram.
    });
    return {
      ...seo,
      links: [
        ...seo.links,
        {
          rel: "preload",
          as: "image",
          href: HOME.heroPoster,
          type: "image/webp",
          fetchpriority: "high",
          imagesrcset: cdnSrcSet(HOME.heroPosterPath, [768, 1080, 1440]),
          imagesizes: "100vw",
        },
      ],
    };
  },
  component: Index,
});

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Paint the poster first; hydrate the heavy MP4 after the browser is idle.
    // On small viewports, skip autoplaying the MP4 entirely — poster is enough.
    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)").matches;

    if (isCoarse) return;

    const start = () => setActive(true);
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 2200 });
    } else {
      timeoutId = globalThis.setTimeout(start, 1200) as unknown as number;
    }

    return () => {
      if (idleId != null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = videoRef.current;
    if (!el) return;
    el.preload = "metadata";
    void el.play().catch(() => {
      /* autoplay can be blocked — poster remains */
    });
  }, [active]);

  return (
    <>
      <img
        src={HOME.heroPoster}
        srcSet={cdnSrcSet(HOME.heroPosterPath, [768, 1080, 1440])}
        sizes="100vw"
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          active ? "opacity-0" : "opacity-100"
        }`}
        fetchPriority="high"
        decoding="async"
      />
      {active && (
        <video
          ref={videoRef}
          src={heroVideo.url}
          muted
          loop
          playsInline
          preload="none"
          poster={HOME.heroPosterMobile}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </>
  );
}

function Index() {
  const featured = WORKS.slice(0, 6);

  return (
    <div>
      {/* HERO — poster-first, deferred video */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden md:items-center">
        <HeroVideo />
        {/* Light scrim only — video already carries a mild grade */}
        <div className="absolute inset-0 bg-obsidian/35" />
        <div className="absolute inset-0 plate-scrim" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-[6vw] pb-8 pt-28 md:pb-32 md:pt-24">
          <div className="mb-8 flex items-center gap-4 animate-fade-up">
            <span className="h-[6px] w-[6px] rounded-full bg-ember shadow-[0_0_12px_theme(colors.ember)]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-ember">
              Запись открыта · Санкт-Петербург
            </span>
          </div>

          <h1
            className="mt-6 max-w-[1100px] font-display uppercase leading-[1.02] text-ivory animate-fade-up"
            style={{
              fontSize: "clamp(40px,7.4vw,116px)",
              letterSpacing: "0.03em",
              animationDelay: ".1s",
            }}
          >
            Европейский
            <br />
            стандарт
            <br />
            детейлинга.
          </h1>
          <p
            className="mt-8 max-w-[560px] text-[16px] leading-[1.9] text-mute animate-fade-up"
            style={{ animationDelay: ".2s" }}
          >
            Более 10 лет опыта, клубная атмосфера и сервис, в который хочется возвращаться. Вы
            уникальны — и ваш автомобиль тоже.
          </p>
          <div
            className="mt-10 flex flex-col gap-3 animate-fade-up sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-4"
            style={{ animationDelay: ".3s" }}
          >
            <Link to="/kontakty" className="btn-line btn-ember">
              Рассчитать стоимость
            </Link>
            <Link to="/raboty" className="btn-line">
              Наши работы
            </Link>
          </div>

          {/* Mobile: scroll cue sits in flow under CTAs — no overlap */}
          <div className="mt-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-mute-2 md:hidden">
            <span>Листайте</span>
            <span className="h-8 w-px bg-gradient-to-b from-mute-2 to-transparent" />
          </div>
        </div>

        {/* Desktop: anchored to the viewport bottom */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-mute-2 md:flex">
          <span>Листайте</span>
          <span className="h-12 w-px bg-gradient-to-b from-mute-2 to-transparent" />
        </div>
      </section>

      {/* О СТУДИИ */}
      <Section
        num="01"
        title="О студии"
        heading="Мы не просто выполняем работу — мы создаём результат."
      >
        <div className="grid gap-14 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-14 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden">
            <CdnImage
              src={HOME.studio}
              alt="Студия UNIQUE"
              className="h-full w-full object-cover"
              sizes="(min-width: 768px) 40vw, 90vw"
              loading="lazy"
            />
            <div className="absolute inset-0 plate-scrim" />
            <p className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.35em] text-ivory">
              Внутри студии
            </p>
          </div>
          <div className="space-y-6 text-[15.5px] leading-[1.95] text-mute md:max-w-none">
            <p>
              Премиальная детейлинг-студия UNIQUE в Санкт-Петербурге — европейский уровень сервиса и
              технологические карты, отработанные в действующем центре за рубежом. Мы работаем с
              автомобилями высшего класса: от полной оклейки защитной полиуретановой плёнкой (PPF)
              без разбора кузова до смены цвета плёнкой и керамической защиты.
            </p>
            <p>
              Каждый проект ведёт мастер, отвечающий за результат от первой панели до выдачи.
              Диагностика под направленным светом, аккуратный раскрой, кромки заведены под панели —
              так, чтобы защита оставалась невидимой, а заводской лак — целым на годы вперёд.
            </p>
            <p>
              Более 10 лет практики, сотни премиальных автомобилей и собственная плёнка UNIQUE с
              самовосстановлением и клубной гарантией 10 лет. Здесь нет конвейера: атмосфера клуба,
              прозрачный договор и сервис, в который хочется возвращаться.
            </p>
            <p>
              Вы уникальны — и ваш автомобиль тоже. Мы сохраняем характер машины и даём ей защиту,
              достойную её класса.
            </p>
          </div>
        </div>
      </Section>

      {/* 3 КЛЮЧЕВЫХ ПРЕИМУЩЕСТВА */}
      <section className="border-y border-line bg-obsidian-2 px-[6vw] py-24">
        <div className="mx-auto grid max-w-[1280px] gap-[2px] bg-line md:grid-cols-3">
          {[
            [
              "Идеальная оклейка",
              "без разбора автомобиля",
              "Технология европейского центра — плёнка заводится под кромки без снятия оптики, ручек и эмблем.",
            ],
            [
              "Собственная плёнка UNIQUE",
              "с уникальными свойствами",
              "Разработана нашим центром — эластичность 320%, самовосстановление и глубина цвета выше стандарта.",
            ],
            [
              "Действующий премиум-центр",
              "в Европе",
              "Более 10 лет практики в европейской студии — стандарты и мастера, привезённые сюда без компромиссов.",
            ],
          ].map(([h1, h2, copy], i) => (
            <div key={h1} className="bg-obsidian p-10">
              <span className="font-display text-xs uppercase tracking-[0.3em] text-ember">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="mt-8 font-display text-2xl uppercase leading-tight text-ivory"
                style={{ letterSpacing: "0.05em" }}
              >
                {h1}
              </h3>
              <p className="text-[11px] uppercase tracking-[0.3em] text-mute-2 mt-2">{h2}</p>
              <p className="mt-6 text-[14.5px] leading-[1.85] text-mute">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* УСЛУГИ ЦЕНТРА */}
      <Section num="02" title="Услуги центра" heading="Четыре направления. Один стандарт.">
        <div className="grid gap-16 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="space-y-[2px]">
            {SERVICES_HOME.map((s, i) => (
              <details
                key={s.title}
                className="group border-t border-line bg-obsidian"
                open={i === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-6 list-none">
                  <div>
                    <span className="font-display text-[13px] text-mute-2 mr-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-display text-[18px] uppercase text-ivory"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      {s.title}
                    </span>
                  </div>
                  <span className="text-ember text-xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-8 pl-16 text-[14.5px] leading-[1.85] text-mute">
                  <p>{s.copy}</p>
                  {s.bullets && (
                    <ul className="mt-4 space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span className="mt-2 h-px w-4 bg-ember" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to="/uslugi/$slug"
                    params={{ slug: s.page }}
                    className="mt-6 inline-block text-[11px] uppercase tracking-[0.3em] text-ivory hover:text-ember"
                  >
                    Подробнее об услуге →
                  </Link>
                </div>
              </details>
            ))}
            <div className="border-t border-line pt-8">
              <Link to="/uslugi" className="btn-line">
                Все услуги
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <CdnImage
              src={HOME.services}
              alt="Работа в студии"
              className="h-full w-full object-cover"
              sizes="(min-width: 768px) 40vw, 90vw"
              loading="lazy"
            />
            <div className="absolute inset-0 plate-scrim" />
          </div>
        </div>
      </Section>

      {/* ВЫПОЛНЕННЫЕ РАБОТЫ */}
      <Section num="03" title="Выполненные работы" heading="Портфолио, которым мы гордимся.">
        <div className="grid gap-[2px] bg-line md:grid-cols-3">
          {featured.map((w, i) => (
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
                sizes="(min-width: 768px) 33vw, 90vw"
                loading="lazy"
              />
              <div className="absolute inset-0 plate-scrim" />
              <div className="relative z-10">
                <p className="eyebrow mb-3 text-mute-2">
                  {String(i + 1).padStart(2, "0")} · {w.category}
                </p>
                <h3
                  className="font-display uppercase leading-tight text-ivory"
                  style={{ fontSize: "26px", letterSpacing: "0.06em" }}
                >
                  {w.brand}
                </h3>
                <p className="mt-1 text-[15px] text-mute">{w.model}</p>
                <span className="link-more mt-5">Подробнее</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link to="/raboty" className="btn-line">
            Все работы
          </Link>
        </div>
      </Section>

      {/* ПЛЁНКА UNIQUE — split editorial */}
      <section className="border-y border-line bg-obsidian-2">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[60vh]">
            <CdnImage
              src={HOME.film}
              alt="Плёнка UNIQUE"
              className="absolute inset-0 h-full w-full object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              loading="lazy"
            />
            <div className="absolute inset-0 plate-scrim" />
          </div>
          <div className="flex items-center px-[8vw] py-24">
            <div className="max-w-[520px]">
              <p className="eyebrow mb-6">Эксклюзивная плёнка Unique</p>
              <h2
                className="font-display uppercase leading-tight text-ivory"
                style={{ fontSize: "clamp(30px,3.4vw,46px)", letterSpacing: "0.05em" }}
              >
                Особые свойства, которые вы почувствуете.
              </h2>
              <p className="mt-8 text-[15.5px] leading-[1.95] text-mute">
                Эластичность 320%, самовосстановление и глубина цвета выше стандарта. Ложится без
                разбора автомобиля и защищает лак на годы.
              </p>
              <div className="mt-10">
                <Link to="/plenka" className="btn-line btn-ember">
                  Узнать о плёнке
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ЦИФРЫ */}
      <Section num="04" title="Цифры" heading="Более десяти лет — и каждая цифра честная.">
        <div className="grid gap-[2px] bg-line md:grid-cols-4">
          {[
            ["10+", "лет опыта", "В европейском и российском детейлинге."],
            ["500+", "автомобилей", "Обработано за годы практики."],
            ["10", "лет гарантии", "На собственную плёнку UNIQUE PPF."],
            ["9", "мастеров в команде", "Каждый — со своей узкой специализацией."],
          ].map(([n, l, c]) => (
            <div key={l} className="bg-obsidian p-10 text-center md:text-left">
              <p
                className="font-display text-ember"
                style={{ fontSize: "clamp(56px,6vw,88px)", letterSpacing: "0.02em" }}
              >
                {n}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-ivory">{l}</p>
              <p className="mt-4 text-[13.5px] leading-[1.8] text-mute">{c}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ЦИТАТА */}
      <section className="relative overflow-hidden border-y border-line py-40 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${HOME.quote})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian" />
        <blockquote className="relative z-10 mx-auto max-w-[900px] px-[6vw]">
          <p
            className="font-display uppercase leading-[1.2] text-ivory"
            style={{ fontSize: "clamp(26px,3.4vw,42px)", letterSpacing: "0.06em" }}
          >
            «Идеальная оклейка — та, о которой не думаешь. Плёнка UNIQUE делает своё дело тихо.»
          </p>
          <footer className="mt-10 text-[11px] uppercase tracking-[0.4em] text-mute">
            — Мастер студии UNIQUE
          </footer>
        </blockquote>
      </section>

      {/* КЛУБ UNIQUE — тизер */}
      <Section num="05" title="Клуб Unique" heading="Не просто клиент. Часть закрытого клуба.">
        <div className="grid gap-14 md:grid-cols-3">
          {[
            [
              "Персональный менеджер",
              "Прямая линия с мастером, который вёл ваш автомобиль от первого дня.",
            ],
            [
              "Ежегодная ревизия",
              "Раз в год — бесплатная проверка плёнки и покрытия по клубной программе.",
            ],
            [
              "Закрытые мероприятия",
              "Приглашения на клубные встречи, тест-драйвы и партнёрские события.",
            ],
          ].map(([t, c], i) => (
            <div key={t} className="border-t border-line pt-10">
              <p className="font-display text-3xl text-mute-2">{String(i + 1).padStart(2, "0")}</p>
              <h3
                className="mt-8 font-display text-2xl uppercase text-ivory"
                style={{ letterSpacing: "0.05em" }}
              >
                {t}
              </h3>
              <p className="mt-6 text-[14.5px] leading-[1.85] text-mute">{c}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link to="/klub" className="btn-line">
            Подробнее о клубе
          </Link>
        </div>
      </Section>

      {/* ПАРТНЁРЫ — маркетинговая полоса */}
      <div className="overflow-hidden border-y border-line bg-obsidian-2 py-8">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap font-display text-2xl uppercase tracking-[0.35em] text-mute-2">
          {[
            "AUDI",
            "ASTON MARTIN",
            "BMW",
            "BENTLEY",
            "MERCEDES-BENZ",
            "PORSCHE",
            "LAMBORGHINI",
            "FERRARI",
            "ROLLS-ROYCE",
            "RANGE ROVER",
            "MCLAREN",
            "MASERATI",
            "AUDI",
            "ASTON MARTIN",
            "BMW",
            "BENTLEY",
            "MERCEDES-BENZ",
            "PORSCHE",
          ].map((c, i) => (
            <span key={c + i} className="opacity-70">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ОТЗЫВЫ — TODO(client): заменить примеры на реальные отзывы клиентов перед запуском. */}
      <Section num="06" title="Отзывы" heading="Что говорят наши клиенты.">
        <div className="grid gap-px bg-line md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="bg-obsidian p-8">
              <blockquote className="text-[14.5px] leading-[1.9] text-mute">«{r.quote}»</blockquote>
              <figcaption className="mt-6 text-[11px] uppercase tracking-[0.25em] text-mute-2">
                {r.name} · {r.car}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section num="07" title="Вопросы и ответы" heading="Частые вопросы.">
        <div className="divide-y divide-line border-t border-line">
          {FAQ_HOME.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[16px] uppercase leading-tight text-ivory md:text-[18px]">
                {f.q}
                <span className="shrink-0 font-display text-xl text-mute-2 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[760px] text-[14.5px] leading-[1.9] text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative border-y border-line px-[6vw] py-40 text-center">
        <h2
          className="mx-auto max-w-[900px] font-display uppercase leading-tight text-ivory"
          style={{ fontSize: "clamp(28px,4vw,52px)", letterSpacing: "0.06em" }}
        >
          Ваш автомобиль уже
          <br />
          ждёт трансформации.
        </h2>
        <p className="mx-auto mt-8 max-w-[520px] text-[15px] leading-[1.9] text-mute">
          Оставьте заявку — мы рассчитаем стоимость и предложим удобное время в клубной студии
          UNIQUE.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link to="/kontakty" className="btn-line btn-ember">
            Рассчитать стоимость
          </Link>
          <Link to="/raboty" className="btn-line">
            Посмотреть работы
          </Link>
        </div>
      </section>
    </div>
  );
}

const SERVICES_HOME = [
  {
    title: "Оклейка защитной полиуретановой плёнкой (PPF) без разбора авто",
    page: "ppf-unique-protection",
    copy: "Надёжная защита кузова от сколов, царапин, реагентов и песка — полная или по зонам, без разбора автомобиля.",
    bullets: [
      "Максимальная защита кузова от сколов и царапин.",
      "Сохранение заводского вида на годы.",
      "Работа без разбора — оптика, ручки и эмблемы остаются на месте.",
    ],
  },
  {
    title: "Смена цвета плёнкой без разбора авто — полиуретан или винил",
    page: "smena-cveta-poliuretan",
    copy: "Обратимая смена цвета кузова без вмешательства в заводскую окраску: полиуретан UNIQUE Protection (180 цветов) или винил (200+ цветов), включая индивидуальную винилографию.",
    bullets: [
      "180 цветов полиуретана и 200+ цветов винила.",
      "Возможность вернуть заводской цвет в любой момент.",
    ],
  },
  {
    title: "Керамическая защита кузова, дисков и стёкол",
    page: "keramika",
    copy: "Керамическое покрытие 9H создаёт кристаллическую защитную плёнку на лаке. Дополняет PPF или используется самостоятельно — для гидрофобности, глубины цвета и лёгкой мойки.",
    bullets: ["Защита кузова, колёсных дисков и стёкол.", "Гарантия сохранения свойств до 5 лет."],
  },
  {
    title: "Комплекс «Восстановление + защита»",
    page: "polirovka-kuzova",
    copy: "Многоступенчатая полировка лакокрасочного покрытия — устранение мелких царапин, голограмм и следов эксплуатации, с последующим нанесением плёнки или керамики.",
    bullets: [
      "Восстановление ЛКП до состояния «как новое».",
      "Индивидуальный подбор дальнейшей защиты.",
    ],
  },
];

const FAQ_HOME = [
  {
    q: "Разбираете ли вы автомобиль при оклейке защитной полиуретановой плёнкой (PPF)?",
    a: "Нет — оклейка полиуретановой плёнкой (PPF) выполняется без разбора автомобиля: оптика, ручки, эмблемы и молдинги остаются на месте, что сокращает риски и срок работ.",
  },
  {
    q: "В чём разница между полиуретановой и виниловой плёнкой при смене цвета?",
    a: "Полиуретановая плёнка UNIQUE Protection (180 цветов) даёт двойной эффект — смену цвета и защитные свойства PPF. Виниловая плёнка (200+ цветов) — более широкая палитра оттенков и фактур, включая индивидуальные дизайн-проекты винилографии.",
  },
  {
    q: "Можно ли вернуть заводской цвет автомобиля?",
    a: "Да, обе плёнки — полиуретан и винил — снимаются без повреждения заводского лакокрасочного покрытия, поэтому смена цвета полностью обратима.",
  },
  {
    q: "Какая гарантия действует на работы?",
    a: "На выполненные работы и материалы UNIQUE предоставляется гарантия; условия фиксируются в договоре при записи на услугу.",
  },
  {
    q: "Можно ли забрать или доставить автомобиль без личного визита в студию?",
    a: "Да — доступен забор и доставка автомобиля эвакуатором из / в любую точку города, а также такси бизнес-класса для клиента при личной сдаче автомобиля в студию.",
  },
  {
    q: "Сколько времени занимает оклейка и сколько она стоит?",
    a: "Полная оклейка защитной плёнкой (PPF) занимает 5–10 дней, смена цвета — 10–14 дней. Стоимость PPF — от 180 000 ₽, смены цвета — от 320 000 ₽; точную цену рассчитываем после осмотра автомобиля. Сроки и цены остальных услуг — на страницах услуг.",
  },
  {
    q: "Можно ли заказать несколько услуг сразу?",
    a: "Да, для этого есть комплексы услуг — например, PPF с керамикой или детейлинг-мойка с химчисткой салона за один визит. Если нужной услуги нет в студии, подключим профильных партнёров, и все работы будут выполнены «под ключ» у нас.",
  },
  {
    q: "Как записаться на услугу?",
    a: "Оставьте заявку на странице нужной услуги или в разделе «Контакты» — менеджер свяжется с вами, уточнит детали и согласует удобное время. Приём автомобилей — по предварительной записи, ежедневно с 9:00.",
  },
  {
    q: "Как узнать статус работ с моим автомобилем?",
    a: "Клиент получает ежедневный видеоотчёт о статусе работ, а также персональную карточку автомобиля с информацией о проведённых работах и использованных материалах.",
  },
];

function Section({
  num,
  title,
  heading,
  children,
}: {
  num: string;
  title: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-[6vw] py-32 md:py-40">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex items-center gap-5">
          <span className="font-display text-[14px] tracking-[0.1em] text-mute-2">{num}</span>
          <span className="h-px flex-1 bg-line" />
          <span className="eyebrow">{title}</span>
        </div>
        <h2
          className="mb-16 max-w-[900px] font-display uppercase leading-[1.1] text-ivory"
          style={{ fontSize: "clamp(28px,4vw,52px)", letterSpacing: "0.05em" }}
        >
          {heading}
        </h2>
        {children}
      </div>
    </section>
  );
}
