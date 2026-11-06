import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, loadBrandFonts } from "./brand";

loadBrandFonts();

export const URL_TEXT = "zone-242.com";

// Timeline (frames @30 fps) — exportée pour caler le sound design.
export const INTRO = {
  barIn: 0,
  typeStart: 18,
  typeEnd: 78, // 12 caractères ≈ 5 images chacun
  cursorIn: 84,
  tap: 102,
  expandStart: 104,
  expandEnd: 132,
  logoIn: 122,
  total: 165,
};

// Image d'apparition de chaque caractère (rythme humain, déterministe).
export const keyFrames: number[] = (() => {
  const gaps = [5, 4, 6, 4, 5, 7, 4, 5, 4, 6, 5, 4];
  const out: number[] = [];
  let f = INTRO.typeStart;
  for (let i = 0; i < URL_TEXT.length; i++) {
    out.push(f);
    f += gaps[i];
  }
  return out;
})();

const BAR_W = 900;
const BAR_H = 128;
const BAR_X = (1080 - BAR_W) / 2;
const BAR_Y = 760;
const BTN = 96;
const BTN_CX = BAR_X + BAR_W - BTN / 2 - 16;
const BTN_CY = BAR_Y + BAR_H / 2;

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barSpring = spring({ frame: frame - INTRO.barIn, fps, config: { damping: 200 } });
  const typed = keyFrames.filter((k) => frame >= k).length;
  const text = URL_TEXT.slice(0, typed);
  const caretOn = typed < URL_TEXT.length ? true : Math.floor(frame / 8) % 2 === 0;

  const btnPulse = spring({
    frame: frame - (INTRO.typeEnd + 2),
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const btnScale = typed === URL_TEXT.length ? 0.85 + 0.15 * btnPulse : 0.85;
  const btnOpacity = interpolate(typed, [0, URL_TEXT.length], [0.45, 1]);

  // Doigt : arrive de bas-droite vers le bouton, appuie à INTRO.tap.
  const cur = interpolate(frame, [INTRO.cursorIn, INTRO.tap - 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.7, 0.2, 1),
  });
  const press = interpolate(frame, [INTRO.tap - 4, INTRO.tap, INTRO.tap + 6], [1, 0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fingerX = interpolate(cur, [0, 1], [BTN_CX + 260, BTN_CX + 8]);
  const fingerY = interpolate(cur, [0, 1], [BTN_CY + 420, BTN_CY + 14]);
  const fingerOpacity = interpolate(
    frame,
    [INTRO.cursorIn, INTRO.cursorIn + 6, INTRO.expandStart + 6, INTRO.expandStart + 14],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Onde au clic
  const ripple = interpolate(frame, [INTRO.tap, INTRO.tap + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cercle blanc qui engloutit l'écran depuis le bouton
  const grow = interpolate(frame, [INTRO.expandStart, INTRO.expandEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.2, 1),
  });
  const maxR = Math.hypot(1080, 1920);
  const r = grow * maxR;

  const logo = spring({ frame: frame - INTRO.logoIn, fps, config: { damping: 14, stiffness: 120 } });
  const barFade = interpolate(frame, [INTRO.expandStart, INTRO.expandStart + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 30%, ${C.NAVY}, ${C.NIGHT})`,
        fontFamily: FONT,
      }}
    >
      {/* Barre d'adresse */}
      <div
        style={{
          position: "absolute",
          left: BAR_X,
          top: BAR_Y,
          width: BAR_W,
          height: BAR_H,
          borderRadius: BAR_H / 2,
          background: C.WHITE,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 44,
          opacity: barSpring * barFade,
          transform: `translateY(${interpolate(barSpring, [0, 1], [50, 0])}px) scale(${interpolate(barSpring, [0, 1], [0.94, 1])})`,
        }}
      >
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke={C.BLUE} strokeWidth="2.6" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <div
          style={{
            marginLeft: 26,
            fontSize: 54,
            fontWeight: 700,
            color: C.INK,
            letterSpacing: 0.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>{text}</span>
          <span
            style={{
              display: "inline-block",
              width: 4,
              height: 62,
              marginLeft: 4,
              background: C.BLUE,
              opacity: caretOn ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* Bouton « aller » */}
      <div
        style={{
          position: "absolute",
          left: BTN_CX - BTN / 2,
          top: BTN_CY - BTN / 2,
          width: BTN,
          height: BTN,
          borderRadius: BTN,
          background: C.ORANGE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: barSpring * btnOpacity * barFade,
          transform: `scale(${btnScale * (frame >= INTRO.tap ? press : 1)})`,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>

      {/* Onde de clic */}
      {ripple > 0 && ripple < 1 ? (
        <div
          style={{
            position: "absolute",
            left: BTN_CX - 110,
            top: BTN_CY - 110,
            width: 220,
            height: 220,
            borderRadius: 220,
            border: `6px solid ${C.ORANGE}`,
            opacity: 1 - ripple,
            transform: `scale(${0.5 + ripple * 1.2})`,
          }}
        />
      ) : null}

      {/* Doigt */}
      <div
        style={{
          position: "absolute",
          left: fingerX - 38,
          top: fingerY - 38,
          width: 76,
          height: 76,
          borderRadius: 76,
          background: "rgba(255,255,255,0.35)",
          border: "4px solid rgba(255,255,255,0.8)",
          opacity: fingerOpacity,
          transform: `scale(${frame >= INTRO.tap - 4 ? press : 1})`,
        }}
      />

      {/* Cercle d'ouverture */}
      <div
        style={{
          position: "absolute",
          left: BTN_CX - r,
          top: BTN_CY - r,
          width: r * 2,
          height: r * 2,
          borderRadius: r * 2,
          background: C.WHITE,
        }}
      />

      {/* Logo */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: logo }}>
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 1500,
            transform: `scale(${interpolate(logo, [0, 1], [0.7, 1])})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
