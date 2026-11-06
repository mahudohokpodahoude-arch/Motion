import { AbsoluteFill, Sequence } from "remotion";
import { C } from "./brand";
import { Intro } from "./Intro";
import { INTRO_BEATS, TOTAL_FRAMES, WORLD_START, b } from "./timeline";
import { World } from "./World";

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 40%, ${C.BLUE_M}, ${C.NAVY} 62%, ${C.NIGHT})` }}>
      <Sequence from={0} durationInFrames={b(INTRO_BEATS)}>
        <Intro />
      </Sequence>
      <Sequence from={b(WORLD_START)} durationInFrames={TOTAL_FRAMES - b(WORLD_START)}>
        <World />
      </Sequence>
    </AbsoluteFill>
  );
};
