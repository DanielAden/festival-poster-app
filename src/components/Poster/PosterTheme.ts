import * as images from '../../images';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';

export abstract class PosterTheme {
  public backgroundImage: string = '';
  public festivalNameColor: string = 'TexasTango';
  public festivalNameFont: string = 'serif';

  public artistFont: string = 'WesternBangBang';
  public artistColor: string = 'white';
  public textMargin: number = 0;
}

export class DesertTheme extends PosterTheme {
  backgroundImage = images.desert;
  festivalNameColor = 'orange';
  festivalNameFont = 'TexasTango';

  artistFont = 'WesternBangBang';
  artistColor = 'orange';

  textMargin = 25;
}

export class PunkTheme extends PosterTheme {
  backgroundImage = images.punk;
  festivalNameColor = '#37C3E1';
  festivalNameFont = 'TexasTango';

  artistFont = 'WesternBangBang';
  artistColor = '#37C3E1';
}

export class RockTheme extends PosterTheme {
  backgroundImage = images.metal;
  festivalNameColor = '#7C7170';
  festivalNameFont = 'MadridGrunge';
  textMargin = 35;

  artistFont = 'PunkrockerStamp';
  artistColor = '#7C7170';
}

export class GalaxyTheme extends PosterTheme {
  backgroundImage = images.galaxy;
  festivalNameColor = 'white';
  festivalNameFont = 'Cocogoose';
  textMargin = 50;

  artistFont = 'Monteral';
  artistColor = 'white';
}

export const usePosterTheme = (): PosterTheme => {
  const themeType = useTypedSelector(s => s.poster.themeType);
  const themeMemo = useMemo(() => {
    switch (themeType) {
      case 'punk':
        return new PunkTheme();
      case 'rock':
        return new RockTheme();
      case 'desert':
        return new DesertTheme();
      case 'galaxy':
        return new GalaxyTheme();
      default:
        throw new AppError(`Invalid theme ${themeType}`);
    }
  }, [themeType]);
  return themeMemo;
};
