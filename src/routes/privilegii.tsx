import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHero, Rule } from "@/components/site/PageHero";
import { cdn } from "@/lib/cdn";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/privilegii")({
  head: () =>
    pageSeo({
      title: "Привилегии работы с нами — UNIQUE Detailing",
      description:
        "Почему именно UNIQUE: сервис «под ключ», доставка автомобиля, ежедневные видеоотчёты, персональная карточка автомобиля, гарантия и бонусные программы.",
      path: "/privilegii",
      ogDescription: "Привилегии клиентов студии UNIQUE Detailing.",
    }),
  component: PrivilegiiPage,
});

const PRIVILEGES = [
  {
    title: "Ориентированность на клиента",
    desc: "Высокий уровень сервиса на каждом этапе — от первого звонка до выдачи автомобиля.",
  },
  {
    title: "Работа «под ключ»",
    desc: "Даже если мы лично не оказываем какую-либо услугу — у нас широкий круг дружественных профессионалов, которые будут рады приехать к нам в студию.",
  },
  {
    title: "Забор и доставка автомобиля",
    desc: "Возможность забора / доставки автомобиля клиенту на эвакуаторе в студию и обратно.",
  },
  {
    title: "Такси бизнес-класса",
    desc: "При личной сдаче автомобиля — такси бизнес-класса для клиента из студии в любую точку города.",
  },
  {
    title: "Ежедневный видеоотчёт",
    desc: "Ежедневный видеоотчёт клиенту о статусе работ с автомобилем.",
  },
  {
    title: "Высочайшее качество материалов",
    desc: "Используем материалы и оборудование премиального уровня на каждом этапе работы.",
  },
  {
    title: "Бонусные программы",
    desc: "Бонусные программы и закрытые мероприятия для постоянных клиентов.",
  },
  {
    title: "Гарантия на работы",
    desc: "Официальная гарантия на все проведённые работы, закреплённая договором.",
  },
  {
    title: "Персональная карточка автомобиля",
    desc: "Полная информация о проведённых работах с автомобилем и использованных материалах.",
  },
] as const;

function PrivilegiiPage() {
  return (
    <div>
      <PageHero
        eyebrow="Привилегии работы с нами"
        title={
          <>
            Почему
            <br />
            именно UNIQUE.
          </>
        }
        lede="Клубный уровень сервиса, который сопровождает автомобиль и его владельца на каждом этапе — до, во время и после работ в студии."
        image={cdn("/portfolio/bentley-flying-spur-mulliner-2.jpg")}
      />

      <section className="px-[6vw] py-32">
        <div className="mx-auto max-w-[1280px]">
          <Rule label="Привилегии клиентов UNIQUE" num="01" />
          <div className="grid gap-px bg-line md:grid-cols-3">
            {PRIVILEGES.map((p, i) => (
              <div key={p.title} className="bg-obsidian p-8">
                <p className="font-display text-2xl text-mute-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className="mt-6 font-display text-xl uppercase leading-tight text-ivory"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {p.title}
                </h3>
                <p className="mt-4 text-[14px] leading-[1.85] text-mute">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-[6vw] py-32 text-center">
        <h2
          className="mx-auto max-w-[720px] font-display uppercase leading-tight text-ivory"
          style={{ fontSize: "clamp(26px,3.6vw,44px)", letterSpacing: "0.06em" }}
        >
          Убедитесь в этом на своём автомобиле.
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
