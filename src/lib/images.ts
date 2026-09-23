// Studio portfolio imagery. Paths are local `/portfolio/*` keys; `cdn()`
// rewrites them to Cloudflare R2 when `VITE_CDN_URL` is set.
import { cdn, cdnSrcSet, cdnSized } from "./cdn";

const CAR_IMAGE_PATHS = [
  "/portfolio/rolls-royce-phantom-series-ii-0.jpg",
  "/portfolio/bentley-continental-gt-speed-0.jpg",
  "/portfolio/ferrari-sf90-stradale-0.jpg",
  "/portfolio/lamborghini-revuelto-0.jpg",
  "/portfolio/porsche-911-turbo-s-0.jpg",
  "/portfolio/aston-martin-db12-0.jpg",
  "/portfolio/mercedes-maybach-s-680-0.jpg",
  "/portfolio/range-rover-sv-l460-0.jpg",
  "/portfolio/mclaren-765lt-0.jpg",
  "/portfolio/rolls-royce-spectre-0.jpg",
  "/portfolio/maserati-mc20-cielo-0.jpg",
  "/portfolio/audi-r8-v10-performance-0.jpg",
  "/portfolio/lamborghini-urus-performante-0.jpg",
  "/portfolio/bentley-flying-spur-mulliner-0.jpg",
  "/portfolio/porsche-taycan-turbo-s-0.jpg",
  "/portfolio/ferrari-roma-0.jpg",
  "/portfolio/mercedes-benz-g-63-amg-0.jpg",
  "/portfolio/maserati-grecale-trofeo-0.jpg",
];

const LIFESTYLE_IMAGE_PATHS = [
  "/portfolio/aston-martin-db12-craft-1.jpg",
  "/portfolio/rolls-royce-phantom-series-ii-2.jpg",
  "/portfolio/bentley-flying-spur-mulliner-2.jpg",
  "/portfolio/maserati-grecale-trofeo-craft-6.jpg",
  "/portfolio/porsche-911-turbo-s-3.jpg",
  "/portfolio/mercedes-maybach-s-680-2.jpg",
  "/portfolio/lamborghini-revuelto-det-1.jpg",
  "/portfolio/ferrari-sf90-stradale-craft-4.jpg",
  "/portfolio/maserati-mc20-cielo-2.jpg",
  "/portfolio/aston-martin-dbs-770-ultimate-det-6.jpg",
  "/portfolio/range-rover-sv-l460-2.jpg",
  "/portfolio/bentley-bentayga-speed-craft-1.jpg",
];

export const CAR_IMAGES = CAR_IMAGE_PATHS.map((p) => cdn(p));
export const LIFESTYLE_IMAGES = LIFESTYLE_IMAGE_PATHS.map((p) => cdn(p));

export const carImage = (i: number, w = 1440) =>
  cdnSized(
    CAR_IMAGE_PATHS[
      ((i % CAR_IMAGE_PATHS.length) + CAR_IMAGE_PATHS.length) % CAR_IMAGE_PATHS.length
    ],
    w,
  );
export const lifestyleImage = (i: number, w = 1440) =>
  cdnSized(
    LIFESTYLE_IMAGE_PATHS[
      ((i % LIFESTYLE_IMAGE_PATHS.length) + LIFESTYLE_IMAGE_PATHS.length) %
        LIFESTYLE_IMAGE_PATHS.length
    ],
    w,
  );

export const carImageSrcSet = (i: number, widths: number[] = [480, 768, 1080, 1440]) =>
  cdnSrcSet(
    CAR_IMAGE_PATHS[
      ((i % CAR_IMAGE_PATHS.length) + CAR_IMAGE_PATHS.length) % CAR_IMAGE_PATHS.length
    ],
    widths,
  );

export const carGallery = (seed: number, n = 12) =>
  Array.from({ length: n }, (_, k) => carImage(seed * 3 + k * 5 + (k % 3)));

export const carGalleryIndices = (seed: number, n = 12) =>
  Array.from({ length: n }, (_, k) => (seed * 3 + k * 5 + (k % 3)) % CAR_IMAGES.length);
