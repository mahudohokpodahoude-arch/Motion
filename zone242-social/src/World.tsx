import {
  AbsoluteFill,
  Easing,
  Freeze,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, FPS, loadBrandFonts } from "./brand";
import { BEAT, CTA_START, PANELS, REC_LAST_S, REC_RATE, b } from "./timeline";

loadBrandFonts();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ───────────── Logo extrudé (couches empilées en Z) ───────────── */
const Logo3D: React.FC<{ width: number; depth?: number }> = ({ width, depth = 7 }) => {
  const h = (width * 1680) / 2880;
  return (
    <div style={{ position: "relative", width, height: h, transformStyle: "preserve-3d" }}>
      {Array.from({ length: depth }).map((_, i) => {
        const front = i === depth - 1;
        return (
          <Img
            key={i}
            src={staticFile(front ? "logo.png" : "logo_dark.png")}
            style={{
              position: "absolute",
              inset: 0,
              width,
              transform: `translateZ(${(i - depth + 1) * 6}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ───────────── Fond : formes flottantes en profondeur ───────────── */
const seeded = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 22 }).map((_, i) => {
        const x = (seeded(i) - 0.5) * 1700;
        const y = (seeded(i + 40) - 0.5) * 2300;
        const z = -300 - seeded(i + 80) * 1500;
        const size = 40 + seeded(i + 120) * 90;
        const orange = i % 3 === 0;
        const ring = i % 2 === 0;
        const drift = Math.sin(frame / (40 + (i % 5) * 9) + i) * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + x - size / 2,
              top: 960 + y + drift - size / 2,
              width: size,
              height: size,
              borderRadius: ring ? size : size * 0.18,
              background: ring ? "transparent" : orange ? C.ORANGE : C.BLUE_M,
              border: ring ? `${Math.max(5, size * 0.1)}px solid ${orange ? C.ORANGE : "#6F64F2"}` : "none",
              opacity: 0.55,
              transform: `translateZ(${z}px) rotateZ(${frame * (0.4 + seeded(i + 3)) * (i % 2 ? 1 : -1)}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

/* ───────────── Panneaux d'information ───────────── */
type Slot = "top" | "bottom";

const Panel: React.FC<{
  range: readonly [number, number];
  slot: Slot;
  dark?: boolean;
  children: (rel: number) => React.ReactNode; // rel : images depuis l'entrée
}> = ({ range, slot, dark, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = b(range[0]);
  const end = b(range[1]);
  if (frame < start || frame > end + b(1.4)) return null;
  const p = spring({ frame: frame - start, fps, config: { damping: 15, stiffness: 110 } });
  const q = interpolate(frame, [end, end + b(1.2)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const sgn = slot === "top" ? -1 : 1;
  const sway = Math.sin(frame / 26 + (slot === "top" ? 0 : 2)) * 3;
  const z = interpolate(p, [0, 1], [-1100, 150]) + q * 700;
  const style: React.CSSProperties = {
    position: "absolute",
    left: 60,
    width: 960,
    padding: "46px 52px",
    boxSizing: "border-box",
    borderRadius: 64,
    background: dark ? C.BLUE : C.WHITE,
    color: dark ? C.WHITE : C.INK,
    boxShadow: "0 50px 120px rgba(0,0,0,0.5)",
    opacity: p * (1 - q),
    transformOrigin: slot === "top" ? "50% 100%" : "50% 0%",
    transform: `translateZ(${z}px) rotateY(${(1 - p) * sgn * 55 + sway}deg) rotateX(${q * sgn * 35}deg)`,
    ...(slot === "top" ? { bottom: 1920 - 560 } : { top: 1360 }),
  };
  return <div style={style}>{children(frame - start)}</div>;
};

const Label: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 7, color: dark ? "#C9C3FF" : C.ORANGE, textTransform: "uppercase" }}>
    {children}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; hot?: boolean; dark?: boolean }> = ({ children, hot, dark }) => (
  <div
    style={{
      padding: "14px 28px",
      borderRadius: 50,
      fontSize: 34,
      whiteSpace: "nowrap",
      fontWeight: 800,
      background: hot ? C.ORANGE : dark ? "rgba(255,255,255,0.16)" : C.MIST,
      color: hot ? C.WHITE : dark ? C.WHITE : C.BLUE,
    }}
  >
    {children}
  </div>
);

const count = (rel: number, to: number, beats = 1.6) =>
  Math.round(interpolate(rel, [0, b(beats)], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) }));

const STEPS = ["Accueil", "Fondements", "Baptême", "Membre", "Service", "Leadership"];

const Panels: React.FC = () => (
  <>
    {/* 1. Slogan */}
    <Panel range={PANELS.slogan} slot="top">
      {() => (
        <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 1.02, textAlign: "center" }}>
          <div style={{ color: C.BLUE }}>CONNECTER</div>
          <div style={{ color: C.BLUE }}>TRANSFORMER</div>
          <div style={{ color: C.ORANGE }}>ENVOYER</div>
        </div>
      )}
    </Panel>

    {/* 2. Verset */}
    <Panel range={PANELS.verset} slot="bottom" dark>
      {() => (
        <>
          <Label dark>Née d&apos;un verset</Label>
          <div style={{ fontSize: 124, fontWeight: 900, lineHeight: 1.05, marginTop: 6, whiteSpace: "nowrap" }}>ACTES 2.42</div>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#E0DCFF", marginTop: 10 }}>Une zone, c&apos;est un espace d&apos;action.</div>
        </>
      )}
    </Panel>

    {/* 3. Chiffres */}
    <Panel range={PANELS.chiffres} slot="top">
      {(rel) => (
        <div style={{ display: "flex", gap: 40 }}>
          {[
            { n: 2, l: "CULTES", s: "chaque semaine" },
            { n: 20, l: "DÉPARTEMENTS", s: "pour trouver ta place" },
          ].map((x) => (
            <div key={x.l} style={{ flex: 1 }}>
              <div style={{ fontSize: 210, fontWeight: 900, color: C.BLUE, lineHeight: 1 }}>{count(rel, x.n)}</div>
              <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: 5, color: C.ORANGE }}>{x.l}</div>
              <div style={{ fontSize: 36, fontWeight: 700, opacity: 0.7 }}>{x.s}</div>
            </div>
          ))}
        </div>
      )}
    </Panel>

    {/* 4. Six étapes */}
    <Panel range={PANELS.etapes} slot="bottom" dark>
      {(rel) => {
        const active = Math.min(5, Math.max(0, Math.floor((rel - b(1.5)) / b(1.5))));
        return (
          <>
            <div style={{ fontSize: 124, fontWeight: 900, lineHeight: 1 }}>6 ÉTAPES</div>
            <div style={{ fontSize: 46, fontWeight: 700, color: "#E0DCFF", margin: "8px 0 28px" }}>
              de visiteur à <span style={{ color: C.ORANGE }}>leader</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {STEPS.map((s, i) => (
                <Pill key={s} dark hot={rel >= b(1.5) && i === active}>
                  {s}
                </Pill>
              ))}
            </div>
          </>
        );
      }}
    </Panel>

    {/* 5. Piliers */}
    <Panel range={PANELS.piliers} slot="top">
      {() => (
        <>
          <div style={{ fontSize: 112, fontWeight: 900, color: C.BLUE, lineHeight: 1 }}>4 PILIERS</div>
          <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.7, margin: "8px 0 26px" }}>Actes 2.42 au cœur de tout ce que nous faisons</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <Pill>Enseignement</Pill>
            <Pill hot>Communion</Pill>
            <Pill>Fraction du pain</Pill>
            <Pill hot>Prière</Pill>
          </div>
        </>
      )}
    </Panel>

    {/* 6. Vision */}
    <Panel range={PANELS.vision} slot="bottom" dark>
      {() => (
        <>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.15 }}>« Lève-toi, sois éclairée, car ta lumière arrive. »</div>
          <div style={{ margin: "16px 0 26px" }}>
            <Label dark>Ésaïe 60.1</Label>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Pill hot>Illuminer</Pill>
            <Pill dark>Former</Pill>
            <Pill dark>Envoyer</Pill>
          </div>
        </>
      )}
    </Panel>

    {/* 7. Églises */}
    <Panel range={PANELS.eglises} slot="top">
      {(rel) => {
        const bar = interpolate(rel, [b(1), b(4)], [0, 7 / 30], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            <div style={{ fontSize: 250, fontWeight: 900, color: C.BLUE, lineHeight: 0.95 }}>{count(rel, 7, 1.2)}</div>
            <div style={{ flex: 1 }}>
              <Label>Églises au Bénin</Label>
              <div style={{ height: 24, borderRadius: 12, background: C.MIST, margin: "22px 0 12px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${bar * 100}%`, borderRadius: 12, background: `linear-gradient(90deg, ${C.BLUE}, ${C.ORANGE})` }} />
              </div>
              <div style={{ fontSize: 40, fontWeight: 800 }}>
                Vision 2032 : <span style={{ color: C.ORANGE }}>30</span>
              </div>
            </div>
          </div>
        );
      }}
    </Panel>

    {/* 8. Équipe */}
    <Panel range={PANELS.equipe} slot="bottom" dark>
      {() => (
        <>
          <div style={{ fontSize: 86, fontWeight: 900, lineHeight: 1.05 }}>
            CEUX QUI VEILLENT
            <br />
            <span style={{ color: C.ORANGE }}>sur la maison</span>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
            <Pill dark hot>Collège pastoral</Pill>
            <Pill dark>Jeunesse et médias</Pill>
          </div>
        </>
      )}
    </Panel>

    {/* 9. Ressources */}
    <Panel range={PANELS.ressources} slot="top">
      {() => (
        <div style={{ display: "flex", gap: 40 }}>
          <div style={{ flex: 1 }}>
            <Label>Ses livres</Label>
            <div style={{ fontSize: 54, fontWeight: 900, color: C.BLUE, lineHeight: 1.1, marginTop: 8 }}>Prière, foi, vie chrétienne</div>
          </div>
          <div style={{ width: 4, background: C.MIST }} />
          <div style={{ flex: 1 }}>
            <Label>Zone TV</Label>
            <div style={{ fontSize: 54, fontWeight: 900, color: C.BLUE, lineHeight: 1.1, marginTop: 8 }}>Cultes en direct</div>
          </div>
        </div>
      )}
    </Panel>

    {/* 10. Venir */}
    <Panel range={PANELS.venir} slot="bottom" dark>
      {() => (
        <>
          <div style={{ fontSize: 86, fontWeight: 900, lineHeight: 1, whiteSpace: "nowrap" }}>
            VIENS <span style={{ color: C.ORANGE }}>NOUS VOIR</span>
          </div>
          <div style={{ display: "flex", gap: 16, margin: "26px 0 20px" }}>
            <Pill hot>Dimanche 8h45</Pill>
            <Pill dark>Vendredi 19h45</Pill>
          </div>
          <div style={{ fontSize: 42, fontWeight: 800 }}>
            Avenue Yèkpè · <span style={{ color: "#FFB8A6" }}>50 m avant Golf-FM</span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#C9C3FF", marginTop: 6 }}>Sikècodji, Cotonou</div>
        </>
      )}
    </Panel>
  </>
);

/* ───────────── Appel à l'action ───────────── */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (beat: number, damping = 13, stiffness = 120) =>
    spring({ frame: frame - b(CTA_START + beat), fps, config: { damping, stiffness } });
  const logo = at(0.5, 14, 90);
  const url = at(2.5, 12, 130);
  const btn1 = at(5.5);
  const btn2 = at(6.5);
  const pulse = 1 + Math.sin(frame / 7) * 0.012;
  if (frame < b(CTA_START)) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: (1080 - 760) / 2,
          top: 190,
          opacity: logo,
          transform: `translateZ(${interpolate(logo, [0, 1], [-900, 260])}px) rotateY(${Math.sin(frame / 30) * 16}deg) rotateX(${(1 - logo) * 50}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div style={{ background: C.WHITE, borderRadius: 80, padding: "0 0", transformStyle: "preserve-3d" }}>
          <Logo3D width={760} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          width: 860,
          top: 700,
          textAlign: "center",
          padding: "44px 0",
          borderRadius: 120,
          background: C.BLUE,
          color: C.WHITE,
          fontSize: 100,
          fontWeight: 900,
          whiteSpace: "nowrap",
          boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
          opacity: url,
          transform: `translateZ(${interpolate(url, [0, 1], [-800, 220])}px) scale(${pulse})`,
        }}
      >
        zone-242<span style={{ color: C.ORANGE }}>.com</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1650, display: "flex", justifyContent: "center", gap: 28 }}>
        <div
          style={{
            padding: "30px 44px",
            borderRadius: 100,
            background: C.ORANGE,
            color: C.WHITE,
            fontSize: 40,
            fontWeight: 800,
            whiteSpace: "nowrap",
            opacity: btn1,
            transform: `translateZ(${interpolate(btn1, [0, 1], [-600, 200])}px)`,
          }}
        >
          Planifier une visite
        </div>
        <div
          style={{
            padding: "30px 44px",
            borderRadius: 100,
            background: C.WHITE,
            color: C.BLUE,
            fontSize: 40,
            fontWeight: 800,
            whiteSpace: "nowrap",
            opacity: btn2,
            transform: `translateZ(${interpolate(btn2, [0, 1], [-600, 200])}px)`,
          }}
        >
          Demande de prière
        </div>
      </div>
    </>
  );
};

/* ───────────── Monde 3D ───────────── */
const PHONE_W = 540;
const PHONE_H = 1130;

export const World: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Caméra : léger balancement + coup de pouce sur chaque temps.
  const beat = frame / BEAT;
  const kick = Math.exp(-(beat % 1) * 7) * 22;
  const ry = Math.sin(frame / 55) * 10;
  const rx = 3 + Math.sin(frame / 75) * 3;

  // Téléphone : arrivée en profondeur, puis réduction pour l'appel à l'action.
  const pe = spring({ frame, fps, config: { damping: 18, stiffness: 70 } });
  const cta = interpolate(frame, [b(CTA_START - 1.5), b(CTA_START + 1)], [0, 1], { ...clamp, easing: Easing.bezier(0.6, 0, 0.2, 1) });
  const phoneScale = interpolate(cta, [0, 1], [1, 0.52]);
  const phoneY = interpolate(cta, [0, 1], [0, 290]);
  const float = Math.sin(frame / 24) * 12;
  const phoneRy = (1 - pe) * 75 + Math.sin(frame / 45) * 7;

  const recCut = Math.round((REC_LAST_S / REC_RATE) * FPS);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, perspective: 2400, perspectiveOrigin: "50% 48%", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `translateZ(${kick}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        }}
      >
        <Particles />

        <div
          style={{
            position: "absolute",
            left: (1080 - PHONE_W) / 2,
            top: (1920 - PHONE_H) / 2,
            width: PHONE_W,
            height: PHONE_H,
            borderRadius: 92,
            padding: 18,
            boxSizing: "border-box",
            background: "linear-gradient(145deg, #2d2d40, #08080f)",
            boxShadow: "0 90px 160px rgba(0,0,0,0.65), inset 0 0 0 4px #43435e",
            opacity: Math.min(1, pe * 2),
            transform: `translateY(${float + phoneY}px) translateZ(${interpolate(pe, [0, 1], [-2400, 0])}px) rotateY(${phoneRy}deg) scale(${phoneScale})`,
          }}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: 76, overflow: "hidden", background: "#fff", position: "relative" }}>
            <Freeze frame={Math.min(frame, recCut)}>
              <OffthreadVideo src={staticFile("screen.mp4")} muted playbackRate={REC_RATE} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Freeze>
            <div style={{ position: "absolute", top: 16, left: "50%", marginLeft: -56, width: 112, height: 28, borderRadius: 14, background: "#050508" }} />
          </div>
        </div>

        <Panels />
        <Cta />
      </div>
    </AbsoluteFill>
  );
};
