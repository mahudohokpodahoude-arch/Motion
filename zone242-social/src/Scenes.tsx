import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, loadBrandFonts } from "./brand";
import { BEAT, b } from "./timeline";

loadBrandFonts();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Apparition en ressort à partir d'un temps (beats) de la scène. */
const useEnter = (atBeat: number, damping = 16, stiffness = 120) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - b(atBeat), fps, config: { damping, stiffness } });
};

const Logo: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <Img src={staticFile("logo.png")} style={{ width, ...style }} />
);

/* ───────────── 2. SLOGAN ───────────── */
const Word: React.FC<{ text: string; at: number; color: string }> = ({ text, at, color }) => {
  const p = useEnter(at, 14, 110);
  return (
    <div
      style={{
        fontSize: 122,
        fontWeight: 900,
        color,
        lineHeight: 1.02,
        opacity: p,
        transformOrigin: "50% 100%",
        transform: `perspective(1200px) rotateX(${interpolate(p, [0, 1], [-80, 0])}deg) translateY(${interpolate(p, [0, 1], [80, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const Slogan: React.FC = () => {
  const frame = useCurrentFrame();
  const logoIn = interpolate(frame, [0, b(2)], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
  const sub = useEnter(14, 200);
  return (
    <AbsoluteFill style={{ background: C.WHITE, fontFamily: FONT, alignItems: "center" }}>
      <Logo
        width={interpolate(logoIn, [0, 1], [1500, 640])}
        style={{ position: "absolute", top: interpolate(logoIn, [0, 1], [380, -40]) }}
      />
      <div style={{ position: "absolute", top: 640, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Word text="CONNECTER" at={2} color={C.BLUE} />
        <Word text="TRANSFORMER" at={6} color={C.BLUE} />
        <Word text="ENVOYER" at={10} color={C.ORANGE} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1520,
          width: 900,
          textAlign: "center",
          fontSize: 58,
          fontWeight: 700,
          color: C.INK,
          lineHeight: 1.25,
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0, 1], [40, 0])}px)`,
        }}
      >
        Rencontrer Jésus. Trouver une famille. <span style={{ color: C.ORANGE }}>Grandir.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 3. CHIFFRES ───────────── */
const Stat: React.FC<{ n: number; label: string; sub: string; at: number }> = ({ n, label, sub, at }) => {
  const frame = useCurrentFrame();
  const p = useEnter(at, 18, 100);
  const count = Math.round(
    interpolate(frame, [b(at), b(at) + b(1.6)], [0, n], { ...clamp, easing: Easing.out(Easing.cubic) }),
  );
  return (
    <div
      style={{
        width: 440,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])}) translateY(${interpolate(p, [0, 1], [60, 0])}px)`,
      }}
    >
      <div style={{ fontSize: 290, fontWeight: 900, color: C.WHITE, lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 50, fontWeight: 800, color: C.ORANGE, letterSpacing: 6, marginTop: 6 }}>{label}</div>
      <div style={{ fontSize: 38, fontWeight: 700, color: "#C9C3FF", marginTop: 8, lineHeight: 1.2 }}>{sub}</div>
    </div>
  );
};

export const Chiffres: React.FC = () => {
  const frame = useCurrentFrame();
  const goal = useEnter(11, 200);
  const bar = interpolate(frame, [b(11.5), b(14.5)], [0, 7 / 30], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(160deg, ${C.BLUE}, ${C.BLUE_D})`, fontFamily: FONT, alignItems: "center" }}
    >
      <div style={{ position: "absolute", top: 170, left: 90, fontSize: 52, fontWeight: 800, color: "#C9C3FF", letterSpacing: 8 }}>
        LA ZONE EN CHIFFRES
      </div>
      <div style={{ position: "absolute", top: 300, left: 90, right: 90, display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 110 }}>
        <Stat n={2} label="CULTES" sub="chaque semaine, dimanche et vendredi" at={1} />
        <Stat n={20} label="DÉPARTEMENTS" sub="pour trouver ta place" at={4} />
        <Stat n={6} label="ÉTAPES" sub="de visiteur à leader" at={7} />
        <Stat n={7} label="ÉGLISES" sub="de MILMO au Bénin" at={9.5} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 190,
          left: 90,
          right: 90,
          opacity: goal,
          transform: `translateY(${interpolate(goal, [0, 1], [50, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 800, color: C.WHITE, marginBottom: 22 }}>
          Vision 2032 : <span style={{ color: C.ORANGE }}>30 églises</span>
        </div>
        <div style={{ height: 26, borderRadius: 13, background: "rgba(255,255,255,0.22)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${bar * 100}%`, borderRadius: 13, background: `linear-gradient(90deg, #fff, ${C.ORANGE})` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 700, color: "#C9C3FF", marginTop: 14 }}>
          <span>7 AUJOURD&apos;HUI</span>
          <span>30 EN 2032</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 4. PARCOURS ───────────── */
const STEPS = [
  ["Accueil", "31 jours pour une nouvelle vie"],
  ["Fondements", "10 cours de fondement"],
  ["Baptême", "Eau et Saint-Esprit"],
  ["Membre", "4 cours de membre"],
  ["Service", "Un département"],
  ["Leadership", "Discipulat puis iBUILD"],
];

const StepRow: React.FC<{ i: number; active: boolean }> = ({ i, active }) => {
  const p = useEnter(1 + i * 0.5, 18, 110);
  const act = spring({ frame: useCurrentFrame() - 0, fps: 30, config: { damping: 200 } });
  void act;
  return (
    <div
      style={{
        height: 150,
        borderRadius: 40,
        display: "flex",
        alignItems: "center",
        padding: "0 44px",
        gap: 36,
        background: active ? C.BLUE : "transparent",
        color: active ? C.WHITE : C.INK,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [120, 0])}px) scale(${active ? 1.04 : 1})`,
        transition: "none",
        boxShadow: active ? "0 24px 60px rgba(25,0,207,0.35)" : "none",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color: active ? "#A9A2FF" : "#9A96C4", width: 64 }}>0{i + 1}</div>
      <div>
        <div style={{ fontSize: 66, fontWeight: 900, lineHeight: 1 }}>{STEPS[i][0]}</div>
        <div style={{ fontSize: 36, fontWeight: 700, opacity: 0.8, marginTop: 8 }}>{STEPS[i][1]}</div>
      </div>
    </div>
  );
};

export const Parcours: React.FC = () => {
  const frame = useCurrentFrame();
  const head = useEnter(0, 200);
  const active = Math.min(5, Math.max(0, Math.floor((frame - b(4)) / b(2.4))));
  const started = frame >= b(4);
  return (
    <AbsoluteFill style={{ background: C.MIST, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 90,
          right: 90,
          opacity: head,
          transform: `translateY(${interpolate(head, [0, 1], [-40, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 900, color: C.BLUE, lineHeight: 1 }}>
          6 ÉTAPES
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: C.INK, marginTop: 14 }}>
          de visiteur à <span style={{ color: C.ORANGE }}>leader</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 560, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 28 }}>
        {STEPS.map((_, i) => (
          <StepRow key={i} i={i} active={started && i === active} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 5. LE SITE (téléphone 3D) ───────────── */
const CHIPS = [
  "Qui sommes-nous",
  "Grandir",
  "Piliers",
  "L'équipe",
  "Ses livres",
  "Servir",
  "Zone TV",
  "Nous trouver",
  "Inviter",
];

const Chip: React.FC<{ text: string; i: number }> = ({ text, i }) => {
  const frame = useCurrentFrame();
  const at = 3 + i * 2.8;
  const p = useEnter(at, 12, 130);
  const left = i % 2 === 0;
  const y = 330 + Math.floor(i / 2) * 330 + (left ? 0 : 150);
  const bob = Math.sin((frame + i * 17) / 14) * 10;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        [left ? "left" : "right"]: 36,
        padding: "26px 44px",
        borderRadius: 60,
        fontSize: 50,
        fontWeight: 800,
        color: i % 3 === 0 ? C.WHITE : C.INK,
        background: i % 3 === 0 ? C.ORANGE : C.WHITE,
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        opacity: p,
        transform: `translateY(${bob}px) scale(${interpolate(p, [0, 1], [0.4, 1])}) translateX(${interpolate(p, [0, 1], [left ? -200 : 200, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const Site: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const rotY = Math.sin(frame / 38) * 16;
  const rotX = 5 + Math.sin(frame / 53) * 3;
  const float = Math.sin(frame / 22) * 14;
  const title = useEnter(0, 200);
  return (
    <AbsoluteFill
      style={{ background: `radial-gradient(110% 70% at 50% 40%, ${C.BLUE_M}, ${C.NAVY} 70%, ${C.NIGHT})`, fontFamily: FONT }}
    >
      <div
        style={{
          position: "absolute",
          top: 120,
          width: "100%",
          textAlign: "center",
          fontSize: 78,
          fontWeight: 900,
          color: C.WHITE,
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [-40, 0])}px)`,
        }}
      >
        Tout est sur <span style={{ color: C.ORANGE }}>le site</span>
      </div>

      <div style={{ position: "absolute", inset: 0, perspective: 2600 }}>
        <div
          style={{
            position: "absolute",
            left: (1080 - 600) / 2,
            top: 380,
            width: 600,
            height: 1260,
            borderRadius: 96,
            background: "linear-gradient(145deg, #2a2a3a, #0a0a12)",
            padding: 20,
            boxSizing: "border-box",
            boxShadow: "0 80px 140px rgba(0,0,0,0.6), inset 0 0 0 4px #3b3b52",
            transform: `translateY(${float + interpolate(enter, [0, 1], [900, 0])}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${interpolate(enter, [0, 1], [0.7, 1])})`,
          }}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: 78, overflow: "hidden", background: "#fff", position: "relative" }}>
            <OffthreadVideo
              src={staticFile("screen.mp4")}
              muted
              playbackRate={5}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: 18,
                left: "50%",
                marginLeft: -60,
                width: 120,
                height: 30,
                borderRadius: 15,
                background: "#050508",
              }}
            />
          </div>
        </div>
      </div>

      {CHIPS.map((c, i) => (
        <Chip key={c} text={c} i={i} />
      ))}
    </AbsoluteFill>
  );
};

/* ───────────── 6. VENIR ───────────── */
const InfoCard: React.FC<{ day: string; time: string; at: number; dark?: boolean }> = ({ day, time, at, dark }) => {
  const p = useEnter(at, 16, 110);
  return (
    <div
      style={{
        flex: 1,
        padding: "48px 40px",
        borderRadius: 56,
        background: dark ? C.BLUE : C.WHITE,
        color: dark ? C.WHITE : C.INK,
        boxShadow: "0 30px 80px rgba(25,0,207,0.18)",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [120, 0])}px) rotateX(${interpolate(p, [0, 1], [30, 0])}deg)`,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 6, color: dark ? "#C9C3FF" : C.ORANGE }}>{day}</div>
      <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1.05, marginTop: 14 }}>{time}</div>
    </div>
  );
};

export const Venir: React.FC = () => {
  const head = useEnter(0, 200);
  const addr = useEnter(8, 16, 110);
  const pin = useEnter(9, 8, 140);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.WHITE}, ${C.MIST})`, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 90,
          right: 90,
          fontSize: 150,
          fontWeight: 900,
          lineHeight: 1,
          color: C.BLUE,
          opacity: head,
          transform: `translateY(${interpolate(head, [0, 1], [-50, 0])}px)`,
        }}
      >
        VIENS
        <br />
        <span style={{ color: C.ORANGE }}>NOUS VOIR</span>
      </div>
      <div style={{ position: "absolute", top: 780, left: 70, right: 70, display: "flex", gap: 36, perspective: 1600 }}>
        <InfoCard day="DIMANCHE" time="8h45" at={3} dark />
        <InfoCard day="VENDREDI" time="19h45" at={5} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1340,
          left: 70,
          right: 70,
          padding: "52px 48px",
          borderRadius: 56,
          background: C.WHITE,
          display: "flex",
          alignItems: "center",
          gap: 40,
          boxShadow: "0 30px 80px rgba(25,0,207,0.18)",
          opacity: addr,
          transform: `translateY(${interpolate(addr, [0, 1], [120, 0])}px)`,
        }}
      >
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: 65,
            background: C.ORANGE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${interpolate(pin, [0, 1], [-120, 0])}px) scale(${pin})`,
            flexShrink: 0,
          }}
        >
          <svg width="70" height="70" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 66, fontWeight: 900, color: C.BLUE, lineHeight: 1.05 }}>Avenue Yèkpè</div>
          <div style={{ fontSize: 46, fontWeight: 800, color: C.ORANGE, marginTop: 10 }}>50 m avant Golf-FM</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: C.INK, opacity: 0.7, marginTop: 8 }}>Sikècodji · Cotonou</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 7. APPEL À L'ACTION ───────────── */
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useEnter(0, 14, 110);
  const url = useEnter(3, 12, 130);
  const btn1 = useEnter(6, 14, 120);
  const btn2 = useEnter(7, 14, 120);
  const pulse = 1 + Math.sin(frame / 7) * 0.012;
  return (
    <AbsoluteFill style={{ background: C.WHITE, fontFamily: FONT, alignItems: "center" }}>
      <Logo
        width={1000}
        style={{
          position: "absolute",
          top: 120,
          opacity: logo,
          transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 880,
          padding: "46px 84px",
          borderRadius: 120,
          background: C.BLUE,
          color: C.WHITE,
          fontSize: 118,
          fontWeight: 900,
          boxShadow: "0 40px 90px rgba(25,0,207,0.4)",
          opacity: url,
          transform: `scale(${interpolate(url, [0, 1], [0.5, 1]) * pulse})`,
        }}
      >
        zone-242<span style={{ color: C.ORANGE }}>.com</span>
      </div>
      <div style={{ position: "absolute", top: 1230, display: "flex", flexDirection: "column", gap: 34, alignItems: "center" }}>
        <div
          style={{
            padding: "40px 80px",
            borderRadius: 100,
            background: C.ORANGE,
            color: C.WHITE,
            fontSize: 62,
            fontWeight: 800,
            opacity: btn1,
            transform: `translateY(${interpolate(btn1, [0, 1], [80, 0])}px)`,
          }}
        >
          Planifier une visite
        </div>
        <div
          style={{
            padding: "40px 80px",
            borderRadius: 100,
            background: C.MIST,
            color: C.BLUE,
            fontSize: 62,
            fontWeight: 800,
            opacity: btn2,
            transform: `translateY(${interpolate(btn2, [0, 1], [80, 0])}px)`,
          }}
        >
          Demande de prière
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", whiteSpace: "nowrap", fontSize: 34, fontWeight: 800, color: C.INK, letterSpacing: 4, opacity: btn2 }}>
        CONNECTER <span style={{ color: C.ORANGE }}>•</span> TRANSFORMER <span style={{ color: C.ORANGE }}>•</span> ENVOYER
      </div>
    </AbsoluteFill>
  );
};

void BEAT;
