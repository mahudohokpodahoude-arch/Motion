import { Composition } from "remotion";
import { FPS } from "./brand";
import { Main } from "./Main";
import { TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return <Composition id="Social" component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />;
};
