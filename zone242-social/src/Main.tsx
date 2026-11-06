import { AbsoluteFill, Sequence } from "remotion";
import { Intro } from "./Intro";
import { Chiffres, Cta, Parcours, Site, Slogan, Venir } from "./Scenes";
import { S, b } from "./timeline";

const seq = (range: readonly [number, number]) => ({
  from: b(range[0]),
  durationInFrames: b(range[1]) - b(range[0]),
});

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <Sequence {...seq(S.intro)}>
        <Intro />
      </Sequence>
      <Sequence {...seq(S.slogan)}>
        <Slogan />
      </Sequence>
      <Sequence {...seq(S.chiffres)}>
        <Chiffres />
      </Sequence>
      <Sequence {...seq(S.parcours)}>
        <Parcours />
      </Sequence>
      <Sequence {...seq(S.site)}>
        <Site />
      </Sequence>
      <Sequence {...seq(S.venir)}>
        <Venir />
      </Sequence>
      <Sequence {...seq(S.cta)}>
        <Cta />
      </Sequence>
    </AbsoluteFill>
  );
};
