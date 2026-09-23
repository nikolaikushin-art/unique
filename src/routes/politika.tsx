import { createFileRoute, Link } from "@tanstack/react-router";
import { pageSeo } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/cdn";

export const Route = createFileRoute("/politika")({
  head: () =>
    pageSeo({
      title: "Политика конфиденциальности — UNIQUE Detailing",
      description:
        "Политика обработки персональных данных студии UNIQUE Detailing. Как мы используем данные, оставленные в заявке на сайте.",
      path: "/politika",
    }),
  component: PolitikaPage,
});

function PolitikaPage() {
  return (
    <div className="px-[6vw] pb-32 pt-36">
      <div className="mx-auto max-w-[760px]">
        <p className="eyebrow mb-6">Документы</p>
        <h1
          className="font-display uppercase leading-tight text-ivory"
          style={{ fontSize: "clamp(32px,4vw,52px)", letterSpacing: "0.04em" }}
        >
          Политика конфиденциальности
        </h1>
        <div className="mt-12 space-y-6 text-[15.5px] leading-[1.95] text-mute">
          <p>
            Настоящая политика описывает, как студия UNIQUE Detailing («мы») обрабатывает
            персональные данные, которые вы оставляете через форму заявки на сайте{" "}
            <span className="text-ivory">uniquedetailing.ru</span>.
          </p>
          <p>
            <span className="text-ivory">Какие данные мы можем получить:</span> имя, телефон, адрес
            электронной почты, марка и модель автомобиля, выбранная услуга и комментарий к заявке.
          </p>
          <p>
            <span className="text-ivory">Зачем:</span> чтобы связаться с вами, рассчитать стоимость
            работ, согласовать визит в студию и ответить на вопросы. Данные не продаются и не
            передаются третьим лицам для рекламы.
          </p>
          <p>
            <span className="text-ivory">Срок хранения:</span> до достижения цели обработки или до
            вашего запроса на удаление — если иное не требуется законом.
          </p>
          <p>
            <span className="text-ivory">Ваши права:</span> вы можете запросить уточнение,
            ограничение обработки или удаление данных, написав на{" "}
            <a
              className="text-ivory underline-offset-4 hover:underline"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <p>
            Отправляя заявку на сайте, вы подтверждаете согласие на обработку указанных данных в
            целях обратной связи и записи в студию.
          </p>
        </div>

        <div id="consent" className="mt-16 scroll-mt-28 border-t border-line pt-12">
          <p className="eyebrow mb-6">Согласие на обработку персональных данных</p>
          <div className="space-y-6 text-[15.5px] leading-[1.95] text-mute">
            <p>
              Заполняя форму заявки на сайте <span className="text-ivory">uniquedetailing.ru</span>,
              субъект персональных данных даёт согласие студии UNIQUE Detailing на обработку
              указанных в форме персональных данных (имя, телефон, адрес электронной почты, марка и
              модель автомобиля, комментарий) в целях обратной связи, расчёта стоимости услуг и
              записи на приём.
            </p>
            <p>
              Согласие действует до момента его отзыва. Отозвать согласие можно, написав на{" "}
              <a
                className="text-ivory underline-offset-4 hover:underline"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-14">
          <Link to="/kontakty" className="btn-line">
            Вернуться к контактам
          </Link>
        </div>
      </div>
    </div>
  );
}
