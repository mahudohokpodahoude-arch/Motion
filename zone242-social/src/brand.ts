import { continueRender, delayRender, staticFile } from "remotion";

export const C = {
  BLUE: "#1900CF",
  BLUE_D: "#12009A",
  BLUE_M: "#3B2BE6",
  ORANGE: "#FF5A36",
  NIGHT: "#0B0733",
  NAVY: "#14104A",
  INK: "#14122B",
  MIST: "#EEECFF",
  WHITE: "#FFFFFF",
};

export const FPS = 30;
// Plafond demandé : 1 min 10 s. La durée finale suivra la musique.
export const MAX_SECONDS = 70;

export const FONT = "Montserrat, sans-serif";

let loaded = false;
export const loadBrandFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("fonts");
  Promise.all(
    [700, 800, 900].map((w) => {
      const f = new FontFace(
        "Montserrat",
        `url(${staticFile(`montserrat-latin-${w}-normal.woff2`)})`,
        { weight: String(w) },
      );
      return f.load().then((ff) => document.fonts.add(ff));
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
