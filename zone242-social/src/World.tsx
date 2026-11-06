import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, FPS, loadBrandFonts } from "./brand";
import { BEAT, CTA_START, SHOTS, b } from "./timeline";

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

const rg = (k: keyof typeof SHOTS) => [SHOTS[k][0] + 0.5, SHOTS[k][1]] as const;

const STEPS = ["Accueil", "Fondements", "Baptême", "Membre", "Service", "Leadership"];

const Panels: React.FC = () => (
  <>
    {/* 1. Slogan */}
    <Panel range={rg("slogan")} slot="top">
      {() => (
        <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 1.02, textAlign: "center" }}>
          <div style={{ color: C.BLUE }}>CONNECTER</div>
          <div style={{ color: C.BLUE }}>TRANSFORMER</div>
          <div style={{ color: C.ORANGE }}>ENVOYER</div>
        </div>
      )}
    </Panel>

    {/* 2. Verset */}
    <Panel range={rg("verset")} slot="bottom" dark>
      {() => (
        <>
          <Label dark>Née d&apos;un verset</Label>
          <div style={{ fontSize: 124, fontWeight: 900, lineHeight: 1.05, marginTop: 6, whiteSpace: "nowrap" }}>ACTES 2.42</div>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#E0DCFF", marginTop: 10 }}>Une zone, c&apos;est un espace d&apos;action.</div>
        </>
      )}
    </Panel>

    {/* 3. Chiffres */}
    <Panel range={rg("chiffres")} slot="top">
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
    <Panel range={rg("etapes")} slot="bottom" dark>
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
    <Panel range={rg("piliers")} slot="top">
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
    <Panel range={rg("vision")} slot="bottom" dark>
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
    <Panel range={rg("eglises")} slot="top">
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
    <Panel range={rg("equipe")} slot="bottom" dark>
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
    <Panel range={rg("ressources")} slot="top">
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
    <Panel range={rg("venir")} slot="bottom" dark>
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

    {/* 11. Menu du site */}
    <Panel range={rg("tour")} slot="top">
      {() => (
        <>
          <div style={{ fontSize: 96, fontWeight: 900, color: C.BLUE, lineHeight: 1 }}>
            TOUT EST SUR <span style={{ color: C.ORANGE }}>LE SITE</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 26 }}>
            {["Qui sommes-nous", "Grandir", "Piliers", "L'équipe", "Ses livres", "Servir", "Zone TV", "Nous trouver", "Inviter"].map((m, i) => (
              <Pill key={m} hot={i % 4 === 0}>
                {m}
              </Pill>
            ))}
          </div>
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

/* ───────────── Téléphone et plans ───────────── */
const PHONE_W = 540;
const PHONE_H = 1130;

type Pose = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number };

const PhoneView: React.FC<{ rec: number; rate?: number; pose: Pose; opacity?: number }> = ({ rec, rate = 1, pose, opacity = 1 }) => (
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
      boxShadow: "0 60px 110px rgba(0,0,0,0.6), inset 0 0 0 4px #43435e",
      opacity,
      backfaceVisibility: "hidden",
      transform: `translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg) scale(${pose.s})`,
    }}
  >
    <div style={{ width: "100%", height: "100%", borderRadius: 76, overflow: "hidden", background: "#fff", position: "relative" }}>
      <OffthreadVideo
        src={staticFile("screen.mp4")}
        startFrom={Math.round(rec * FPS)}
        playbackRate={rate}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", top: 16, left: "50%", marginLeft: -56, width: 112, height: 28, borderRadius: 14, background: "#050508" }} />
    </div>
  </div>
);

const ease = Easing.inOut(Easing.cubic);
const mix = (a: number, c: number, p: number) => a + (c - a) * ease(p);
const base: Pose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1 };

/** Frame relatif au plan, avancement 0→1 et flottement. */
const useShot = (range: readonly [number, number]) => {
  const f = useCurrentFrame();
  const dur = b(range[1]) - b(range[0]);
  return { f, p: Math.min(1, f / dur), bob: Math.sin(f / 24) * 12 };
};

const ShotArrival: React.FC = () => {
  const { f, bob } = useShot(SHOTS.slogan);
  const { fps } = useVideoConfig();
  const pe = spring({ frame: f, fps, config: { damping: 18, stiffness: 70 } });
  return <PhoneView rec={0} opacity={Math.min(1, pe * 2)} pose={{ ...base, y: bob, z: -2400 * (1 - pe), ry: (1 - pe) * 75 + Math.sin(f / 45) * 7 }} />;
};

const ShotVerset: React.FC = () => {
  const { p, bob } = useShot(SHOTS.verset);
  return <PhoneView rec={6} pose={{ ...base, x: mix(110, 50, p), y: 90 + bob, z: mix(20, 70, p), rx: 4, ry: mix(-26, -10, p), rz: -3, s: 1.18 }} />;
};

const Carousel: React.FC<{ recs: number[]; range: readonly [number, number]; radius: number; spread: number; sweep: [number, number]; s: number }> = ({
  recs,
  range,
  radius,
  spread,
  sweep,
  s,
}) => {
  const { f, p } = useShot(range);
  return (
    <>
      {recs.map((rec, i) => {
        const th = (i - (recs.length - 1) / 2) * spread + mix(sweep[0], sweep[1], p);
        const r = (th * Math.PI) / 180;
        return (
          <PhoneView
            key={i}
            rec={rec}
            pose={{ ...base, x: radius * Math.sin(r), y: 60 + Math.sin(f / 20 + i * 2) * 12, z: radius * Math.cos(r) - radius + 60, ry: th, s }}
          />
        );
      })}
    </>
  );
};

const ShotFlat: React.FC = () => {
  const { p, bob } = useShot(SHOTS.etapes);
  return <PhoneView rec={24} pose={{ ...base, y: 80 + bob, rx: mix(64, 50, p), rz: mix(8, -32, p), s: 0.98 }} />;
};

const ShotPiliers: React.FC = () => {
  const { p, bob } = useShot(SHOTS.piliers);
  return <PhoneView rec={30} pose={{ ...base, x: mix(-70, -30, p), y: mix(-30, 10, p) + bob, z: 0, rx: mix(-20, -8, p), ry: mix(28, 10, p), s: 1.1 }} />;
};

const ShotVision: React.FC = () => {
  const { p, bob } = useShot(SHOTS.vision);
  return <PhoneView rec={42} pose={{ ...base, y: -150 + bob, z: -160, rx: 6, ry: mix(-50, 34, p), s: mix(0.72, 0.8, p) }} />;
};

const ShotEglises: React.FC = () => {
  const { p, bob } = useShot(SHOTS.eglises);
  return <PhoneView rec={48} pose={{ ...base, y: 40 + bob, rx: mix(68, 46, p), rz: mix(20, -14, p), s: 1.0 }} />;
};

const ShotEquipe: React.FC = () => {
  const { p, bob } = useShot(SHOTS.equipe);
  return <PhoneView rec={60} pose={{ ...base, x: mix(100, 60, p), y: 60 + bob, z: 30, rx: 6, ry: mix(26, 8, p), rz: 2, s: 1.15 }} />;
};

const ShotRessources: React.FC = () => {
  const { f, p } = useShot(SHOTS.ressources);
  return (
    <>
      <PhoneView rec={72} pose={{ ...base, x: -250, y: 20 + Math.sin(f / 22) * 14, rx: 4, ry: mix(26, 16, p), rz: -3, s: 0.86 }} />
      <PhoneView rec={78} pose={{ ...base, x: 250, y: 20 + Math.sin(f / 22 + 3) * 14, rx: 4, ry: mix(-26, -16, p), rz: 3, s: 0.86 }} />
    </>
  );
};

const ShotVenir: React.FC = () => {
  const { p, bob } = useShot(SHOTS.venir);
  return <PhoneView rec={84} pose={{ ...base, y: mix(60, 0, p) + bob, z: mix(-100, 160, p), rx: 4, ry: mix(-16, 14, p), s: 1.06 }} />;
};

const ShotCta: React.FC = () => {
  const { f, bob } = useShot([CTA_START, 130]);
  return <PhoneView rec={84} rate={0.5} pose={{ ...base, y: 290 + bob, ry: Math.sin(f / 45) * 8, s: 0.52 }} />;
};

/** Plan : monté sur le temps, avec son propre extrait de l'enregistrement. */
const Shot: React.FC<{ range: readonly [number, number]; children: React.ReactNode }> = ({ range, children }) => (
  <Sequence from={b(range[0])} durationInFrames={b(range[1]) - b(range[0])} layout="none">
    {children}
  </Sequence>
);

/* ───────────── Monde 3D ───────────── */
export const World: React.FC = () => {
  const frame = useCurrentFrame();

  // Caméra : léger balancement + coup de pouce sur chaque temps.
  const beat = frame / BEAT;
  const kick = Math.exp(-(beat % 1) * 7) * 22;
  const ry = Math.sin(frame / 55) * 5;
  const rx = 2 + Math.sin(frame / 75) * 2;

  // Éclair bref à chaque coupure de plan.
  const cuts = [...Object.values(SHOTS).map((r) => r[0]), CTA_START].filter((x) => x > 0).map((x) => b(x));
  const flash = Math.max(0, ...cuts.map((c) => (frame >= c ? 0.45 * Math.exp(-(frame - c) / 4) : 0)));

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

        <Shot range={SHOTS.slogan}><ShotArrival /></Shot>
        <Shot range={SHOTS.verset}><ShotVerset /></Shot>
        <Shot range={SHOTS.chiffres}>
          <Carousel recs={[12, 24, 60]} range={SHOTS.chiffres} radius={560} spread={44} sweep={[-28, 28]} s={0.7} />
        </Shot>
        <Shot range={SHOTS.etapes}><ShotFlat /></Shot>
        <Shot range={SHOTS.piliers}><ShotPiliers /></Shot>
        <Shot range={SHOTS.vision}><ShotVision /></Shot>
        <Shot range={SHOTS.eglises}><ShotEglises /></Shot>
        <Shot range={SHOTS.equipe}><ShotEquipe /></Shot>
        <Shot range={SHOTS.ressources}><ShotRessources /></Shot>
        <Shot range={SHOTS.venir}><ShotVenir /></Shot>
        <Shot range={SHOTS.tour}>
          <Carousel recs={[0, 24, 30, 60, 84]} range={SHOTS.tour} radius={600} spread={72} sweep={[-36, 36]} s={0.62} />
        </Shot>
        <Shot range={[CTA_START, 130]}><ShotCta /></Shot>

        <Panels />
        <Cta />
      </div>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9), rgba(170,160,255,0.6))",
          opacity: flash,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
