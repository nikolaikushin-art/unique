import { cdn } from "./cdn";

/** UNIQUE film colour & finish examples (shared by /plenka and colour-change service pages). */
export type FilmColour = { img: string; name: string; type: string };

export const COLOURS: FilmColour[] = [
  { img: cdn("/ppf/ppf-c-piano-black.jpg"), name: "Piano Black", type: "Глянец" },
  { img: cdn("/ppf/ppf-c-obsidian-black.jpg"), name: "Obsidian Black", type: "Глянец" },
  { img: cdn("/ppf/ppf-c-satin-black.jpg"), name: "Satin Black", type: "Сатин" },
  { img: cdn("/ppf/ppf-c-matte-charcoal.jpg"), name: "Matte Charcoal", type: "Мат" },
  { img: cdn("/ppf/ppf-c-graphite.jpg"), name: "Graphite", type: "Сатин" },
  { img: cdn("/ppf/ppf-c-metallic-grey.jpg"), name: "Metallic Grey", type: "Металлик" },
  { img: cdn("/ppf/ppf-c-nardo-grey.jpg"), name: "Nardo Grey", type: "Сатин-мат" },
  { img: cdn("/ppf/ppf-c-frozen-grey.jpg"), name: "Frozen Grey", type: "Мат" },
  { img: cdn("/ppf/ppf-c-titanium-silver.jpg"), name: "Titanium Silver", type: "Металлик" },
  { img: cdn("/ppf/ppf-c-champagne-silver.jpg"), name: "Champagne Silver", type: "Металлик" },
  { img: cdn("/ppf/ppf-c-pearl-white.jpg"), name: "Pearl White", type: "Перламутр" },
  { img: cdn("/ppf/ppf-c-racing-blue.jpg"), name: "Racing Blue", type: "Глянец" },
  { img: cdn("/ppf/ppf-c-deep-emerald.jpg"), name: "Deep Emerald", type: "Глянец" },
  { img: cdn("/ppf/ppf-c-burgundy.jpg"), name: "Burgundy", type: "Глянец" },
  { img: cdn("/ppf/ppf-c-bronze-metallic.jpg"), name: "Bronze Metallic", type: "Металлик" },
  { img: cdn("/ppf/ppf-c-carbon.jpg"), name: "Carbon", type: "Карбон" },
];
