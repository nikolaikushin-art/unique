import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { PageHero } from "@/components/site/PageHero";
import { LeadForm } from "@/components/site/LeadForm";
import { cdn } from "@/lib/cdn";
import { pageSeo } from "@/lib/seo";
import { WORK_HOURS, WORK_HOURS_SHORT } from "@/lib/site-config";

const STUDIO_LAT = 59.849;
const STUDIO_LON = 30.74;

/* eslint-disable @typescript-eslint/no-explicit-any -- Leaflet is loaded from
   a CDN at runtime and ships no bundled types in this project. */
/* Premium monochrome map — Leaflet + CARTO tiles loaded client-side only.
 * No traffic layers or vendor chrome; a single UNIQUE red marker on a
 * grayscale basemap, consistent with the luxury identity. */
function PremiumMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;
    let cancelled = false;

    const ensureLeaflet = (): Promise<any> => {
      const w = window as any;
      if (w.L) return Promise.resolve(w.L);
      if (!document.getElementById("leaflet-css")) {
        const css = document.createElement("link");
        css.id = "leaflet-css";
        css.rel = "stylesheet";
        css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(css);
      }
      return new Promise((resolve, reject) => {
        const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => resolve((window as any).L));
          existing.addEventListener("error", reject);
          return;
        }
        const s = document.createElement("script");
        s.id = "leaflet-js";
        s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        s.async = true;
        s.onload = () => resolve((window as any).L);
        s.onerror = reject;
        document.head.appendChild(s);
      });
    };

    ensureLeaflet()
      .then((L) => {
        if (cancelled || !ref.current || (ref.current as any)._leaflet_id) return;
        map = L.map(ref.current, {
          center: [STUDIO_LAT, STUDIO_LON],
          zoom: 10,
          zoomControl: false,
          scrollWheelZoom: false,
          attributionControl: false,
          dragging: true,
        });
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
          subdomains: "abcd",
          className: "uq-map-tiles",
        }).addTo(map);
        L.control.zoom({ position: "bottomright" }).addTo(map);
        L.control
          .attribution({ position: "bottomleft", prefix: false })
          .addAttribution("© OpenStreetMap · CARTO")
          .addTo(map);
        const icon = L.divIcon({
          className: "uq-pin-wrap",
          html: '<span class="uq-pin"></span>',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        L.marker([STUDIO_LAT, STUDIO_LON], { icon, keyboard: false }).addTo(map);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 h-full w-full" aria-label="Карта студии UNIQUE" />
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const Route = createFileRoute("/kontakty")({
  head: () =>
    pageSeo({
      title: "Контакты — UNIQUE Detailing",
      description: `Студия UNIQUE Detailing — Санкт-Петербург, микрорайон Овцино, Петрозаводская улица, 33. ${WORK_HOURS}. info@uniquedetailing.ru`,
      path: "/kontakty",
      ogDescription:
        "Записаться в студию UNIQUE Detailing в Санкт-Петербурге. Расчёт стоимости и запись онлайн.",
    }),
  component: KontaktyPage,
});

function KontaktyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Контакты"
        title={
          <>
            Оставьте заявку.
            <br />
            Мы свяжемся в течение часа.
          </>
        }
        lede="Рассчитаем стоимость, согласуем сроки и подберём удобное время для приезда в клубную студию UNIQUE."
        image={cdn("/portfolio/audi-r8-v10-performance-0.jpg")}
      />

      {/* ЗАЯВЛЕНИЕ О КОНФИДЕНЦИАЛЬНОСТИ ВЛАДЕЛЬЦА */}
      <section className="px-[6vw] pt-16 md:pt-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex max-w-[860px] items-start gap-6">
            <span className="mt-[14px] hidden h-px w-14 shrink-0 bg-ember/70 md:block" />
            <div>
              <p className="eyebrow mb-4">Конфиденциальность</p>
              <p
                className="font-display leading-[1.4] text-ivory/90"
                style={{ fontSize: "clamp(20px,2.4vw,30px)", letterSpacing: "0.02em" }}
              >
                Никакая заявка и ни один автомобиль не публикуются без письменного согласия
                владельца.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ + ФОРМА */}
      <section className="px-[6vw] py-32">
        <div className="mx-auto grid max-w-[1280px] gap-16 md:grid-cols-[0.9fr_1.1fr]">
          {/* Инфо */}
          <aside className="space-y-10">
            <div>
              <p className="eyebrow mb-4">Адрес студии</p>
              <p
                className="font-display text-2xl uppercase text-ivory"
                style={{ letterSpacing: "0.05em" }}
              >
                г. Санкт-Петербург
              </p>
              <p className="mt-3 text-[15px] leading-[1.85] text-mute">
                Ленинградская область,
                <br />
                микрорайон Овцино,
                <br />
                Петрозаводская улица, 33
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-ember">
                <span className="h-[6px] w-[6px] rounded-full bg-ember shadow-[0_0_10px_theme(colors.ember)]" />
                Запись открыта
              </p>
            </div>

            <div>
              <p className="eyebrow mb-4">Связь</p>
              <p className="text-[15px] text-mute">
                <a href="mailto:info@uniquedetailing.ru" className="hover:text-ivory">
                  info@uniquedetailing.ru
                </a>
              </p>
            </div>

            <div>
              <p className="eyebrow mb-4">Режим работы</p>
              <p className="text-[15px] text-mute">{WORK_HOURS}</p>
              <p className="text-[13px] text-mute-2 mt-1">
                Приём автомобилей — по предварительной записи
              </p>
            </div>

            <div>
              <p className="eyebrow mb-4">Дискретность</p>
              <p className="text-[15px] leading-[1.85] text-mute">
                Закрытый приём, отдельный бокс и полная конфиденциальность на каждом этапе работы с
                вашим автомобилем.
              </p>
            </div>

            <figure className="relative overflow-hidden border border-line">
              <div className="aspect-[4/5]">
                <img
                  src={cdn("/portfolio/mercedes-maybach-s-680-ext-2.jpg")}
                  alt="Клубный бокс студии UNIQUE"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 plate-scrim" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[10px] uppercase tracking-[0.35em] text-ivory">
                  Клубный бокс UNIQUE
                </p>
                <p className="mt-2 max-w-[300px] text-[12.5px] leading-[1.7] text-mute">
                  Отдельная зона приёма и закрытая парковка для каждого автомобиля.
                </p>
              </figcaption>
            </figure>
          </aside>

          {/* Форма */}
          <LeadForm />
        </div>
      </section>

      {/* ПРЕМИАЛЬНАЯ КАРТА */}
      <section className="border-t border-line px-[6vw] py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10">
            <p className="eyebrow eyebrow-dot mb-4">Локация клубной студии</p>
            <h2
              className="font-display uppercase leading-tight text-ivory"
              style={{ fontSize: "clamp(26px,3vw,42px)", letterSpacing: "0.05em" }}
            >
              Найдите нас
              <br />
              <span className="text-ember">на карте.</span>
            </h2>
          </div>

          <div className="relative z-0 isolate overflow-hidden border border-line-strong bg-obsidian-2">
            {/* corner accents */}
            <span className="pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l-2 border-t-2 border-ember/70" />
            <span className="pointer-events-none absolute right-0 top-0 z-20 h-8 w-8 border-r-2 border-t-2 border-ember/70" />
            <span className="pointer-events-none absolute bottom-0 left-0 z-20 h-8 w-8 border-b-2 border-l-2 border-ember/70" />
            <span className="pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b-2 border-r-2 border-ember/70" />

            <div className="grid md:grid-cols-[1fr_360px]">
              <div className="relative z-0 isolate min-h-[440px] overflow-hidden bg-[#2a2e34] md:min-h-[580px]">
                <PremiumMap />
                {/* Light vignette only — do not crush map contrast */}
                <div className="pointer-events-none absolute inset-0 z-[2] shadow-[inset_0_0_60px_rgba(8,9,11,0.28)]" />
                <span className="pointer-events-none absolute left-5 top-5 z-[3] flex max-w-[min(92%,22rem)] items-center gap-2 rounded-sm bg-obsidian/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ivory backdrop-blur">
                  <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-ember shadow-[0_0_10px_theme(colors.ember)]" />
                  Петрозаводская ул., 33 · Овцино
                </span>
              </div>

              <aside className="flex flex-col justify-between gap-8 border-t border-line bg-obsidian p-8 md:border-l md:border-t-0 md:p-10">
                <div className="space-y-6">
                  <div>
                    <p className="eyebrow mb-3">Адрес</p>
                    <p
                      className="font-display text-xl uppercase text-ivory"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      Петрозаводская 33
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.8] text-mute">
                      микрорайон Овцино,
                      <br />
                      Ленинградская область
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow mb-3">Режим</p>
                    <p className="text-[14px] text-mute">{WORK_HOURS_SHORT}</p>
                    <p className="mt-1 text-[13px] text-mute-2">Приём — по записи</p>
                  </div>
                  <div className="grid grid-cols-2 gap-px border border-line bg-line text-center">
                    <div className="bg-obsidian px-3 py-4">
                      <p className="font-display text-2xl text-ember">~30</p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-mute-2">
                        мин из центра
                      </p>
                    </div>
                    <div className="bg-obsidian px-3 py-4">
                      <p className="font-display text-2xl text-ember">P</p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-mute-2">
                        клубная парковка
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href="https://yandex.ru/maps/?mode=routes&rtext=~59.849%2C30.740&z=15"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-line btn-ember block text-center"
                  >
                    Проложить маршрут
                  </a>
                  <a
                    href="https://yandex.ru/maps/?ll=30.740%2C59.849&z=16&pt=30.740%2C59.849%2Cpm2rdm"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-line block text-center"
                  >
                    Открыть в Яндекс Картах
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* КАК ДОБРАТЬСЯ */}
      <section className="border-t border-line bg-obsidian-2 px-[6vw] py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 flex items-center gap-5">
            <span className="font-display text-[14px] text-mute-2">02</span>
            <span className="h-px flex-1 bg-line" />
            <span className="eyebrow">Как добраться</span>
          </div>
          <div className="mb-14 grid gap-8 border border-ember/40 bg-obsidian p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
            <div>
              <p className="eyebrow mb-4 text-ember">Забор и доставка</p>
              <h3
                className="font-display uppercase leading-tight text-ivory"
                style={{ fontSize: "clamp(22px,2.6vw,36px)", letterSpacing: "0.05em" }}
              >
                Заберём автомобиль из любой точки города — и вернём обратно.
              </h3>
              <p className="mt-5 max-w-[620px] text-[14.5px] leading-[1.85] text-mute">
                Не нужно ехать самим: эвакуатор заберёт автомобиль у вашего дома или офиса и
                доставит в студию, а после работ вернёт по любому адресу. Если вы приезжаете лично —
                вызовем такси бизнес-класса от студии до нужной точки города.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a href="#zapis" className="btn-line btn-ember text-center">
                Заказать забор автомобиля
              </a>
              <Link to="/privilegii" className="btn-line text-center">
                Все привилегии
              </Link>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              [
                "На автомобиле",
                "Из центра Санкт-Петербурга — около 30 минут по Мурманскому шоссе.",
              ],
              ["Собственная парковка", "Закрытая клубная парковка на территории студии."],
              [
                "Клиентская зона",
                "Уютный лаундж с кофе, Wi-Fi и рабочим местом на время диагностики.",
              ],
            ].map(([t, c]) => (
              <div key={t} className="border-t border-line pt-8">
                <h3
                  className="font-display text-xl uppercase text-ivory"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {t}
                </h3>
                <p className="mt-4 text-[14.5px] leading-[1.85] text-mute">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
