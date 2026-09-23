import { CDN_BASE, cdn } from "./cdn";

/** Production site origin for canonical / OG URLs. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) || "https://uniquedetailing.ru"
).replace(/\/$/, "");

/**
 * Dedicated social share card — 1200×630 JPEG on R2.
 * Use a versioned key so WhatsApp/Telegram/Facebook pick up fresh art after updates.
 * Prefer JPEG (not WebP): many messengers still ignore WebP OG images.
 */
export const OG_IMAGE_PATH = "/og-share-1200.jpg";
export const DEFAULT_OG_IMAGE =
  cdn(OG_IMAGE_PATH) || cdn("/og-cover.jpg") || `${CDN_BASE}/assets/marketing/og-share-1200.jpg`;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT =
  "UNIQUE Detailing — европейский стандарт детейлинга и оклейки защитной полиуретановой плёнкой (PPF)";
export const OG_LOCALE = "ru_RU";
export const SITE_NAME = "UNIQUE Detailing";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  /** Absolute https URL or site path; defaults to branded 1200×630 share card */
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  ogTitle?: string;
  ogDescription?: string;
  type?: "website" | "article";
};

/** Resolve any image path/URL to an absolute https URL suitable for OG scrapers. */
export function absoluteOgImage(image?: string | null): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(image)) {
    // Social scrapers often fail on WebP — prefer JPEG/PNG siblings when possible.
    if (/\.webp(\?|$)/i.test(image)) {
      const jpeg = image
        .replace(/\.w\d+\.webp(\?.*)?$/i, ".jpg$1")
        .replace(/\.webp(\?.*)?$/i, ".jpg$1");
      return jpeg || DEFAULT_OG_IMAGE;
    }
    return image;
  }
  return cdn(image) || DEFAULT_OG_IMAGE;
}

/** Shared title + description + complete Open Graph / Twitter + canonical. */
export function pageSeo({
  title,
  description,
  path,
  image,
  imageAlt = OG_IMAGE_ALT,
  imageWidth,
  imageHeight,
  ogTitle,
  ogDescription,
  type = "website",
}: PageSeoInput) {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const ogT = ogTitle ?? title;
  const ogD = ogDescription ?? description;
  const ogImage = absoluteOgImage(image);

  // Emit width/height only for the branded 1200×630 card, or when the caller
  // explicitly passes dimensions. Portfolio heroes must not inherit 1200×630.
  const isBrandedCard =
    !image ||
    ogImage === DEFAULT_OG_IMAGE ||
    /\/og-share-1200\.jpg(\?|$)/i.test(ogImage) ||
    /\/og-cover\.jpg(\?|$)/i.test(ogImage);

  const width = isBrandedCard ? OG_IMAGE_WIDTH : imageWidth;
  const height = isBrandedCard ? OG_IMAGE_HEIGHT : imageHeight;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: ogT },
      { property: "og:description", content: ogD },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: OG_LOCALE },
      { property: "og:image", content: ogImage },
      { property: "og:image:secure_url", content: ogImage },
      { property: "og:image:type", content: "image/jpeg" },
      ...(width != null && height != null
        ? [
            { property: "og:image:width", content: String(width) },
            { property: "og:image:height", content: String(height) },
          ]
        : []),
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogT },
      { name: "twitter:description", content: ogD },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: imageAlt },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
