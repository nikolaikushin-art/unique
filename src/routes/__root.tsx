import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode, useLayoutEffect } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CDN_BASE } from "@/lib/cdn";
import {
  DEFAULT_OG_IMAGE,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-ivory">404</h1>
        <h2
          className="mt-4 font-display text-xl uppercase text-ivory"
          style={{ letterSpacing: "0.08em" }}
        >
          Страница не найдена
        </h2>
        <p className="mt-4 text-sm text-mute">
          Кажется, эта страница ещё не готова или была перемещена.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-line btn-ember">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4">
      <div className="max-w-md text-center">
        <h1
          className="font-display text-xl uppercase text-ivory"
          style={{ letterSpacing: "0.08em" }}
        >
          Что-то пошло не так
        </h1>
        <p className="mt-4 text-sm text-mute">
          Мы не смогли загрузить эту страницу. Попробуйте обновить или вернуться на главную.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-line btn-ember"
          >
            Попробовать снова
          </button>
          <a href="/" className="btn-line">
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title:
          "UNIQUE Detailing — Европейский стандарт детейлинга и оклейки защитной полиуретановой плёнкой (PPF)",
      },
      {
        name: "description",
        content:
          "Премиальная детейлинг-студия UNIQUE в Санкт-Петербурге. Оклейка защитной полиуретановой плёнкой (PPF) без разбора автомобиля, собственная плёнка Unique, керамика и клубный сервис. Более 10 лет опыта.",
      },
      { name: "author", content: SITE_NAME },
      {
        property: "og:title",
        content:
          "UNIQUE Detailing — Европейский стандарт детейлинга и оклейки защитной полиуретановой плёнкой (PPF)",
      },
      {
        property: "og:description",
        content:
          "Премиальная детейлинг-студия UNIQUE в Санкт-Петербурге. Оклейка защитной полиуретановой плёнкой (PPF) без разбора автомобиля, собственная плёнка Unique, керамика и клубный сервис. Более 10 лет опыта.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { property: "og:image:secure_url", content: DEFAULT_OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
      { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content:
          "UNIQUE Detailing — Европейский стандарт детейлинга и оклейки защитной полиуретановой плёнкой (PPF)",
      },
      {
        name: "twitter:description",
        content:
          "Премиальная детейлинг-студия UNIQUE в Санкт-Петербурге. Оклейка защитной полиуретановой плёнкой (PPF) без разбора автомобиля, собственная плёнка Unique, керамика и клубный сервис. Более 10 лет опыта.",
      },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico?v=2", sizes: "any" },
      { rel: "icon", href: "/favicon-32.png?v=2", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png?v=2" },
      { rel: "manifest", href: "/site.webmanifest" },
      ...(CDN_BASE
        ? [
            { rel: "preconnect", href: CDN_BASE, crossOrigin: "anonymous" as const },
            { rel: "dns-prefetch", href: CDN_BASE },
          ]
        : []),
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Force every pathname change to open at the top with no animated jump. */
function ScrollToTopOnNavigate() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTopOnNavigate />
      <div className="min-h-screen bg-obsidian text-ivory">
        <SiteHeader />
        <main>
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
