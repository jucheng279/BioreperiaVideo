import {Composition, Folder} from 'remotion';
import {BioReperiaFilm} from './Film';
import {Opening} from './scenes/Opening';
import {Platform} from './scenes/Platform';
import {Hero} from './scenes/Hero';
import {Therapies} from './scenes/Therapies';
import {Response} from './scenes/Response';
import {Speed} from './scenes/Speed';
import {Applications} from './scenes/Applications';
import {Closing} from './scenes/Closing';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="BioReperia-30s" component={BioReperiaFilm} width={1920} height={1080} fps={30} durationInFrames={900} defaultProps={{bgm: true, sfx: true}} />
      <Folder name="Scenes">
        <Composition id="01-Variability" component={Opening} width={1920} height={1080} fps={30} durationInFrames={100} defaultProps={{title: 'Every tumor\nresponds differently.', duration: 100}}/>
        <Composition id="02-ZTX" component={Platform} width={1920} height={1080} fps={30} durationInFrames={130} defaultProps={{duration: 130}}/>
        <Composition id="03-Zebrafish" component={Hero} width={1920} height={1080} fps={30} durationInFrames={130} defaultProps={{title: 'Human tumors\nin zebrafish.', duration: 130}}/>
        <Composition id="04-Therapies" component={Therapies} width={1920} height={1080} fps={30} durationInFrames={130} defaultProps={{title: 'Test therapies side by side.', duration: 130}}/>
        <Composition id="05-Response" component={Response} width={1920} height={1080} fps={30} durationInFrames={130} defaultProps={{title: 'Measure tumor response.', duration: 130}}/>
        <Composition id="06-FiveDays" component={Speed} width={1920} height={1080} fps={30} durationInFrames={130} defaultProps={{duration: 130}}/>
        <Composition id="07-Applications" component={Applications} width={1920} height={1080} fps={30} durationInFrames={130} defaultProps={{duration: 130}}/>
        <Composition id="08-BioReperia" component={Closing} width={1920} height={1080} fps={30} durationInFrames={90} defaultProps={{title: 'Changing the gameplan\nfor cancer patients.', duration: 90}}/>
      </Folder>
    </>
  );
};
