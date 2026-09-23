import { CDN_WIDTHS, cdnSrcSet, cdnUrl, cdnWidth } from "@/lib/cdn";

type CdnImageProps = {
  /** Local `/portfolio/...` path or absolute CDN URL */
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  widths?: readonly number[];
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  fetchPriority?: "high" | "low" | "auto";
  /** Prefer a specific width for the jpeg/png fallback `src`. */
  fallbackWidth?: number;
};

/**
 * R2-backed responsive image: WebP srcset + original as fallback.
 * Variants are produced by `scripts/optimize-r2-assets.mjs`.
 */
export function CdnImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  widths = CDN_WIDTHS,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  fallbackWidth,
}: CdnImageProps) {
  const original = cdnUrl(src);
  const fallback = fallbackWidth != null ? cdnWidth(src, fallbackWidth) || original : original;
  const webpSrcSet = cdnSrcSet(src, widths);

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        className={className}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
