import { Composition } from "remotion";
import { FPS } from "./brand";
import { Intro, INTRO } from "./Intro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={INTRO.total}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
