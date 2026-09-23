import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHero, Rule } from "@/components/site/PageHero";
import { cdn } from "@/lib/cdn";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/kompleksy")({
  head: () =>
    pageSeo({
      title: "Комплексы услуг — UNIQUE Detailing",
      description:
        "Готовые пакеты услуг студии UNIQUE: защита, уход и восстановление автомобиля в едином комплексе — со сроками и стоимостью.",
      path: "/kompleksy",
      ogDescription: "Пакетные предложения студии UNIQUE Detailing.",
    }),
  component: KompleksyPage,
});

// TODO(client): confirm final bundle composition, pricing and duration for
// each package — placeholders below combine services already listed on
// /uslugi per the brief's "единая landing page" for «комплексы услуг».
const BUNDLES = [
  {
    id: "protection",
    num: "01",
    title: "Комплекс «Полная защита»",
    copy: "Максимальная защита кузова с первого дня — оклейка защитной полиуретановой плёнкой (PPF) в комплекте с керамическим покрытием поверх плёнки для лучшей гидрофобности и лёгкого ухода.",
    includes: [
      "Полная оклейка защитной плёнкой (PPF)",
      "Керамическое покрытие поверх плёнки",
      "Диагностика и предпродажная мойка кузова",
    ],
    img: cdn("/ppf/ppf-install-apply.jpg"),
  },
  {
    id: "renewal",
    num: "02",
    title: "Комплекс «Восстановление + защита»",
    copy: "Для автомобилей после аренды, каршеринга или активной эксплуатации: полировка лакокрасочного покрытия с последующей защитой плёнкой или керамикой на выбор.",
    includes: [
      "Многоступенчатая полировка кузова",
      "Защита PPF или керамическим покрытием",
      "Контроль под тремя источниками света",
    ],
    img: cdn("/ppf/ppf-install-inspect.jpg"),
  },
  {
    id: "interior-exterior",
    num: "03",
    title: "Комплекс «Салон + кузов»",
    copy: "Комплексный уход снаружи и внутри: детейлинг-мойка, химчистка салона и защитные покрытия кузова за один визит в студию.",
    includes: [
      "Детейлинг-мойка кузова и подкапотного пространства",
      "Комплексная чистка и химчистка салона",
      "Защитное покрытие кузова (керамика / кварц / воск)",
    ],
    img: cdn("/portfolio/bentley-flying-spur-mulliner-2.jpg"),
  },
  {
    id: "color-vinylografiya",
    num: "04",
    title: "Комплекс «Индивидуальный образ»",
    copy: "Смена цвета автомобиля в сочетании с разработкой уникального дизайн-проекта стилевой винилографии — от концепции до оклейки.",
    includes: [
      "Смена цвета плёнкой (полиуретан или винил)",
      "Разработка дизайн-проекта винилографии",
      "Печать и оклейка готового макета",
    ],
    img: cdn("/ppf/ppf-hydrophobic.jpg"),
  },
] as const;

function KompleksyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Комплексы услуг"
        title={
          <>
            Готовые решения.
            <br />
            Единая программа работ.
          </>
        }
        lede="Собрали услуги студии в комплексы, которые решают конкретную задачу — от полной защиты нового автомобиля до восстановления и индивидуального образа."
        image={cdn("/portfolio/mclaren-765lt-0.jpg")}
      />

      <section className="px-[6vw] py-32">
        <div className="mx-auto max-w-[1400px] space-y-20 md:space-y-32">
          {BUNDLES.map((b, i) => (
            <article
              key={b.id}
              id={b.id}
              className={`scroll-mt-28 grid gap-16 md:grid-cols-2 md:items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-obsidian">
                <img
                  src={b.img}
                  alt={b.title}
                  className="h-full w-full object-cover"
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="absolute inset-0 plate-scrim" />
                <p className="absolute bottom-6 left-6 font-display text-6xl text-ivory opacity-90">
                  {b.num}
                </p>
              </div>
              <div>
                <p className="eyebrow mb-6">Комплекс · {b.num}</p>
                <h2
                  className="font-display uppercase leading-tight text-ivory"
                  style={{ fontSize: "clamp(24px,2.6vw,36px)", letterSpacing: "0.05em" }}
                >
                  {b.title}
                </h2>
                <p className="mt-8 text-[15.5px] leading-[1.95] text-mute">{b.copy}</p>
                <ul className="mt-8 space-y-3">
                  {b.includes.map((it) => (
                    <li key={it} className="flex gap-4 text-[14.5px] text-mute">
                      <span className="mt-2 h-px w-5 flex-shrink-0 bg-ember" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex items-center gap-8 border-t border-line pt-8">
                  <Link to="/kontakty" className="btn-line ml-auto">
                    Рассчитать стоимость
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line px-[6vw] py-32">
        <div className="mx-auto max-w-[1280px]">
          <Rule label="Нужен индивидуальный комплекс" num="05" />
          <p className="max-w-[720px] text-[15.5px] leading-[1.95] text-mute">
            Если ни один из готовых комплексов не подходит — соберём программу работ под конкретный
            автомобиль и задачу на первой диагностике в студии.
          </p>
          <div className="mt-10">
            <Link to="/kontakty" className="btn-line btn-ember">
              Обсудить комплекс
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
