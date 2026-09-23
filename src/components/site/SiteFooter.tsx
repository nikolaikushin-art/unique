import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import { CONTACT_EMAIL } from "@/lib/cdn";
import {
  INSTAGRAM_URL,
  MAX_MESSENGER_URL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  TELEGRAM_URL,
  VK_URL,
  WORK_HOURS,
} from "@/lib/site-config";

type FooterLink = { to: string; hash?: string; label: string };

export function SiteFooter() {
  return (
    <footer className="bg-obsidian-2 px-[6vw] pt-24 pb-10">
      <div className="grid gap-12 border-b border-line pb-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <img src={logo.url} alt="UNIQUE Detailing" className="mb-6 h-12 w-auto" />
          <p className="max-w-[340px] text-[14.5px] leading-[1.85] text-mute">
            Премиальная детейлинг-студия с европейским уровнем сервиса. Более 10 лет опыта, клубная
            атмосфера и работа, в которую хочется возвращаться.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-ember">
            <span className="h-[6px] w-[6px] rounded-full bg-ember shadow-[0_0_10px_theme(colors.ember)]" />
            Запись открыта
          </div>
        </div>
        <FooterCol
          title="Меню"
          items={[
            { to: "/uslugi", label: "Услуги" },
            { to: "/kompleksy", label: "Комплексы услуг" },
            { to: "/plenka", label: "Плёнка Unique" },
            { to: "/raboty", label: "Работы" },
            { to: "/privilegii", label: "Привилегии" },
            { to: "/nasledie", label: "Наследие" },
            { to: "/klub", label: "Клуб Unique" },
            { to: "/kontakty", label: "Контакты" },
          ]}
        />
        <FooterCol
          title="Услуги"
          items={[
            { to: "/uslugi/ppf-unique-protection", label: "Оклейка защитной плёнкой (PPF)" },
            { to: "/uslugi/smena-cveta-poliuretan", label: "Смена цвета плёнкой" },
            { to: "/uslugi/stilevaya-vinilografiya", label: "Стилевая винилография" },
            { to: "/uslugi/keramika", label: "Керамическое покрытие" },
            { to: "/uslugi/polirovka-kuzova", label: "Полировка кузова" },
            { to: "/uslugi/himchistka", label: "Химчистка салона" },
            { to: "/uslugi", label: "Все услуги" },
          ]}
        />
        <div>
          <h4 className="mb-6 text-[11px] font-normal uppercase tracking-[0.3em] text-mute-2">
            Контакты
          </h4>
          <div className="space-y-3 text-[14.5px] text-mute">
            <p>г. Санкт-Петербург</p>
            <p className="max-w-[280px]">
              Ленинградская область, микрорайон Овцино, Петрозаводская улица, 33
            </p>
            <p>
              <a className="hover:text-ivory" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
            <p>
              <a className="hover:text-ivory" href={SITE_PHONE_HREF}>
                {SITE_PHONE_DISPLAY}
              </a>
            </p>
            <p className="flex flex-wrap gap-x-5 gap-y-1">
              {[
                ["Instagram", INSTAGRAM_URL],
                ["ВК", VK_URL],
                ["Telegram", TELEGRAM_URL],
                ["Max", MAX_MESSENGER_URL],
              ]
                .filter(([, href]) => href)
                .map(([label, href]) => (
                  <a
                    key={label}
                    className="hover:text-ivory"
                    href={href as string}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {label}
                  </a>
                ))}
            </p>
            <p className="text-mute-2">{WORK_HOURS}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-8 text-[11.5px] tracking-[0.1em] text-mute-2">
        <span>© {new Date().getFullYear()} UNIQUE — все права защищены</span>
        <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link to="/politika" className="transition-colors hover:text-ivory">
            Политика конфиденциальности
          </Link>
          <Link to="/politika" hash="consent" className="transition-colors hover:text-ivory">
            Согласие на обработку персональных данных
          </Link>
        </span>
        <span>Европейский стандарт детейлинга</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <div>
      <h4 className="mb-6 text-[11px] font-normal uppercase tracking-[0.3em] text-mute-2">
        {title}
      </h4>
      <div className="space-y-2 text-[14.5px] text-mute">
        {items.map((i, k) => (
          <Link
            key={i.label + k}
            to={i.to}
            hash={i.hash}
            hashScrollIntoView={{ behavior: "smooth", block: "start" }}
            className="block transition-colors hover:text-ivory"
            onClick={() => {
              if (!i.hash) return;
              // Same-route hash clicks: ensure we scroll even if the router
              // treats the location as unchanged.
              window.setTimeout(() => {
                document
                  .getElementById(i.hash!)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 50);
            }}
          >
            {i.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
