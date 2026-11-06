import { Composition } from "remotion";
import { FPS } from "./brand";
import { Intro, INTRO } from "./Intro";
import { Main } from "./Main";
import { TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Social" component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
      <Composition id="Intro" component={Intro} durationInFrames={INTRO.total} fps={FPS} width={1080} height={1920} />
    </>
  );
};
