import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Rule } from "@/components/site/PageHero";
import { cdn } from "@/lib/cdn";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/klub")({
  head: () =>
    pageSeo({
      title: "Клуб Unique — закрытое сообщество владельцев",
      description:
        "Каждый клиент UNIQUE становится частью клуба. Персональный менеджер, ежегодная ревизия, приоритетная запись и приглашения на закрытые события.",
      path: "/klub",
      ogDescription: "Клубная программа для владельцев автомобилей после работы в студии UNIQUE.",
    }),
  component: KlubPage,
});

const BENEFITS = [
  [
    "Персональный менеджер",
    "Прямая линия с мастером, который вёл ваш автомобиль от первого дня. Ответ в течение часа в рабочее время.",
  ],
  [
    "Ежегодная ревизия",
    "Раз в год — бесплатная проверка плёнки, керамики и салонной защиты по клубной программе.",
  ],
  [
    "Приоритетная запись",
    "Отдельная линия записи для клубных членов — приоритет над стандартной очередью.",
  ],
  [
    "10-летняя гарантия",
    "Официальная гарантия на собственную плёнку UNIQUE PPF, действующая по всей России.",
  ],
  [
    "Клубная книга владельца",
    "Хранит историю всех работ по автомобилю, фотоотчёты и рекомендации по уходу.",
  ],
  [
    "Скидки на дополнительные услуги",
    "Специальные условия на все последующие работы в студии UNIQUE.",
  ],
  ["Закрытые мероприятия", "Приглашения на клубные встречи, тест-драйвы и партнёрские события."],
  ["Услуга подмены", "На время работ — предоставляем автомобиль подмены из клубного парка."],
];

const EVENTS = [
  [
    "Февраль",
    "Клубный завтрак",
    "Ежеквартальная встреча владельцев в студии UNIQUE — знакомство с новыми мастерами и материалами.",
  ],
  [
    "Май",
    "Автомобильная поездка",
    "Однодневный маршрут по Ленинградской области с обедом и фотосессией.",
  ],
  [
    "Август",
    "День открытых дверей",
    "Экскурсия по студии, знакомство с процессом производства плёнки, детальный технический разбор.",
  ],
  [
    "Ноябрь",
    "Годовой ужин клуба",
    "Закрытый ужин для членов клуба — итоги года, планы на следующий сезон, вручение клубных знаков.",
  ],
];

function KlubPage() {
  return (
    <div>
      <PageHero
        eyebrow="Клуб Unique"
        title={
          <>
            Не просто клиент.
            <br />
            Часть клуба.
          </>
        }
        lede="После первой работы вы автоматически становитесь членом клуба UNIQUE — с персональным менеджером, ежегодной ревизией и приглашениями на закрытые события."
        image={cdn("/portfolio/maserati-mc20-cielo-0.jpg")}
      />

      {/* ИНТРО */}
      <section className="px-[6vw] py-32">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="eyebrow eyebrow-dot mb-8">Философия клуба</p>
          <p
            className="font-display uppercase leading-[1.2] text-ivory"
            style={{ fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: "0.06em" }}
          >
            Мы верим, что премиальный сервис не заканчивается в момент выдачи автомобиля. Он
            начинается именно там.
          </p>
        </div>
      </section>

      {/* ПРИВИЛЕГИИ */}
      <section className="bg-obsidian-2 px-[6vw] py-32">
        <div className="mx-auto max-w-[1400px]">
          <Rule label="Привилегии клуба" num="01" />
          <div className="grid gap-[2px] bg-line md:grid-cols-2">
            {BENEFITS.map(([t, c], i) => (
              <div key={t} className="bg-obsidian p-10">
                <p className="font-display text-xl text-mute-2">{String(i + 1).padStart(2, "0")}</p>
                <h3
                  className="mt-8 font-display text-2xl uppercase text-ivory"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {t}
                </h3>
                <p className="mt-6 max-w-[520px] text-[14.5px] leading-[1.85] text-mute">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* СОБЫТИЯ ГОДА */}
      <section className="px-[6vw] py-32">
        <div className="mx-auto max-w-[1280px]">
          <Rule label="Календарь клубных событий" num="02" />
          {EVENTS.map(([m, t, c], i) => (
            <div
              key={t}
              className="grid gap-8 border-t border-line py-10 md:grid-cols-[140px_320px_1fr] md:items-start last:border-b"
            >
              <p
                className="font-display text-2xl uppercase text-ember"
                style={{ letterSpacing: "0.1em" }}
              >
                {m}
              </p>
              <h3
                className="font-display text-2xl uppercase text-ivory"
                style={{ letterSpacing: "0.06em" }}
              >
                {t}
              </h3>
              <p className="text-[15px] leading-[1.9] text-mute">{c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* УРОВНИ */}
      <section className="bg-obsidian-2 px-[6vw] py-32">
        <div className="mx-auto max-w-[1280px]">
          <Rule label="Уровни клубного членства" num="03" />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Silver",
                desc: "Автоматически после первой работы в студии.",
                perks: ["Клубная книга", "10-летняя гарантия", "Приоритетная запись"],
              },
              {
                name: "Gold",
                desc: "После двух работ или комплексной оклейки защитной полиуретановой плёнкой (PPF).",
                perks: ["Всё из Silver", "Персональный менеджер", "Ежегодная ревизия"],
              },
              {
                name: "Black",
                desc: "По приглашению — для постоянных клиентов клуба.",
                perks: ["Всё из Gold", "Услуга подмены", "Закрытые события"],
              },
            ].map((l) => (
              <div
                key={l.name}
                className={`border p-10 ${l.name === "Black" ? "border-ember bg-obsidian" : "border-line bg-obsidian"}`}
              >
                <p
                  className={`font-display text-3xl uppercase ${l.name === "Black" ? "text-ember" : "text-ivory"}`}
                  style={{ letterSpacing: "0.1em" }}
                >
                  {l.name}
                </p>
                <p className="mt-4 text-[14.5px] leading-[1.85] text-mute">{l.desc}</p>
                <ul className="mt-8 space-y-3 text-[14px] text-mute">
                  {l.perks.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2 h-px w-4 flex-shrink-0 bg-ember" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ЦИТАТА */}
      <section className="relative overflow-hidden border-y border-line py-32 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url(${cdn("/portfolio/maserati-grecale-trofeo-craft-6.jpg")})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian" />
        <blockquote className="relative z-10 mx-auto max-w-[860px] px-[6vw]">
          <p
            className="font-display uppercase leading-[1.2] text-ivory"
            style={{ fontSize: "clamp(24px,3.2vw,40px)", letterSpacing: "0.06em" }}
          >
            «Мы не продаём услугу. Мы принимаем в клуб.»
          </p>
        </blockquote>
      </section>

      {/* CTA */}
      <section className="px-[6vw] py-32 text-center">
        <h2
          className="mx-auto max-w-[720px] font-display uppercase leading-tight text-ivory"
          style={{ fontSize: "clamp(26px,3.6vw,44px)", letterSpacing: "0.06em" }}
        >
          Готовы стать частью клуба?
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/kontakty" className="btn-line btn-ember">
            Записаться в студию
          </Link>
          <Link to="/raboty" className="btn-line">
            Посмотреть работы
          </Link>
        </div>
      </section>
    </div>
  );
}
