import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {};

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

const Title: React.FC<{ text: string; delay: number; size: number; color: string }> = ({
  text,
  delay,
  size,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 800,
        color,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [60, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const MyComponent: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const hue = interpolate(frame, [0, durationInFrames], [220, 280], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 14%), hsl(${hue + 40} 70% 28%))`,
        fontFamily: "sans-serif",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        opacity: fadeOut,
      }}
    >
      <Title text="Vidéo de test" delay={0} size={140} color="white" />
      <Title text="Générée par code avec Remotion" delay={Math.round(0.6 * fps)} size={56} color="#cbd5ff" />
    </AbsoluteFill>
  );
};
