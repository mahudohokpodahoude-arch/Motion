import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, loadBrandFonts } from "./brand";
import { b } from "./timeline";

loadBrandFonts();

export const URL_TEXT = "zone-242.com";

// Timeline (images @30 fps) — exportée pour caler le sound design.
// Tout est posé sur la grille de la musique : une touche toutes les double-croches,
// le tap sur le temps 4.
export const INTRO = {
  cursorIn: 36,
  tap: b(4),
  exitStart: b(4) + 2,
  exitEnd: b(5.6),
};

export const keyFrames: number[] = Array.from({ length: URL_TEXT.length }, (_, i) => b(0.5 + i * 0.25));

const BAR_W = 900;
const BAR_H = 128;
const BAR_X = (1080 - BAR_W) / 2;
const BAR_Y = 896;
const BTN = 96;
const BTN_CX = BAR_X + BAR_W - BTN / 2 - 16;
const BTN_CY = BAR_Y + BAR_H / 2;

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barSpring = spring({ frame, fps, config: { damping: 200 } });
  const typed = keyFrames.filter((k) => frame >= k).length;
  const text = URL_TEXT.slice(0, typed);
  const caretOn = typed < URL_TEXT.length ? true : Math.floor(frame / 6) % 2 === 0;

  const ready = typed === URL_TEXT.length;
  const btnPulse = spring({ frame: frame - keyFrames[keyFrames.length - 1], fps, config: { damping: 12, stiffness: 160 } });
  const btnScale = ready ? 0.85 + 0.15 * btnPulse : 0.85;
  const btnOpacity = interpolate(typed, [0, URL_TEXT.length], [0.45, 1]);

  const cur = interpolate(frame, [INTRO.cursorIn, INTRO.tap - 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.7, 0.2, 1),
  });
  const press = interpolate(frame, [INTRO.tap - 4, INTRO.tap, INTRO.tap + 5], [1, 0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fingerX = interpolate(cur, [0, 1], [BTN_CX + 240, BTN_CX + 8]);
  const fingerY = interpolate(cur, [0, 1], [BTN_CY + 380, BTN_CY + 14]);
  const fingerOpacity = interpolate(frame, [INTRO.cursorIn, INTRO.cursorIn + 5, INTRO.exitStart, INTRO.exitStart + 8], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ripple = interpolate(frame, [INTRO.tap, INTRO.tap + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sortie 3D : la barre bascule et fuit dans la profondeur.
  const ex = interpolate(frame, [INTRO.exitStart, INTRO.exitEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.6, 0, 0.9, 0.4),
  });
  const sway = Math.sin(frame / 18);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, perspective: 1800 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `translateZ(${-ex * 2200}px) rotateX(${14 + ex * -70}deg) rotateY(${-12 + sway * 4 + ex * 30}deg)`,
          opacity: barSpring * (1 - ex),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: BAR_X,
            top: BAR_Y,
            width: BAR_W,
            height: BAR_H,
            borderRadius: BAR_H / 2,
            background: C.WHITE,
            boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 44,
            transform: `translateZ(${interpolate(barSpring, [0, 1], [-600, 0])}px)`,
          }}
        >
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke={C.BLUE} strokeWidth="2.6" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <div style={{ marginLeft: 26, fontSize: 54, fontWeight: 700, color: C.INK, letterSpacing: 0.5, display: "flex", alignItems: "center" }}>
            <span>{text}</span>
            <span style={{ display: "inline-block", width: 4, height: 62, marginLeft: 4, background: C.BLUE, opacity: caretOn ? 1 : 0 }} />
          </div>
        </div>

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
            opacity: btnOpacity,
            transform: `translateZ(60px) scale(${btnScale * (frame >= INTRO.tap ? press : 1)})`,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>

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
              transform: `translateZ(60px) scale(${0.5 + ripple * 1.2})`,
            }}
          />
        ) : null}

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
            transform: `translateZ(120px) scale(${frame >= INTRO.tap - 4 ? press : 1})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
