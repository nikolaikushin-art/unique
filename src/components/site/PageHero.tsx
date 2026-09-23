import { carImage, lifestyleImage } from "@/lib/images";
import { CdnImage } from "@/components/site/CdnImage";

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  mode = "car",
  seed = 0,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  image?: string;
  imageAlt?: string;
  mode?: "car" | "lifestyle";
  seed?: number;
}) {
  const bg = image ?? (mode === "lifestyle" ? lifestyleImage(seed, 1440) : carImage(seed, 1440));
  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden border-b border-line">
      <div className="absolute inset-0 animate-drift">
        <CdnImage
          src={bg}
          alt={imageAlt ?? eyebrow}
          className="h-full w-full object-cover"
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          fallbackWidth={1080}
        />
      </div>
      <div className="absolute inset-0 plate-scrim" />
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-[6vw] pt-28">
        <p className="eyebrow eyebrow-dot mb-6">{eyebrow}</p>
        <h1
          className="max-w-[1100px] font-display uppercase leading-[1.02] text-ivory"
          style={{ fontSize: "clamp(38px,6.4vw,96px)", letterSpacing: "0.03em" }}
        >
          {title}
        </h1>
        {lede && <p className="mt-8 max-w-[600px] text-[16px] leading-[1.9] text-mute">{lede}</p>}
      </div>
    </section>
  );
}

export function Rule({ label, num }: { label: string; num?: string }) {
  return (
    <div className="mb-10 flex items-center gap-5">
      {num && <span className="font-display text-[14px] text-mute-2">{num}</span>}
      <span className="h-px flex-1 bg-line" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
