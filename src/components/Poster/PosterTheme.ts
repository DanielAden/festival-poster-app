import * as images from '../../images';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';

export abstract class PosterTheme {
  public backgroundImage: string = '';

  public festivalNameTopRatio: number = 0.03;
  public festivalNameColor: string = 'TexasTango';
  public festivalNameFont: string = 'serif';

  public sideMarginRatio: number = 0;

  public artistFont: string = 'WesternBangBang';
  public artistColor: string = 'white';

  public artistTopRatio = 0.4;
  public artistFontRatio: number = 0.03;

  public festivalNameFontRatio: number = 0.12;
}

export class DesertTheme extends PosterTheme {
  backgroundImage = images.desert;
  festivalNameColor = 'orange';
  festivalNameFont = 'TexasTango';

  artistFont = 'WesternBangBang';
  artistColor = 'orange';

  sideMarginRatio = 0.03;
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

  festivalNameTopRatio = 0.05;
  festivalNameColor = '#7C7170';
  festivalNameFont = 'MadridGrunge';
  sideMarginRatio = 0.035;

  artistFont = 'PunkrockerStamp';
  artistColor = '#7C7170';
  artistFontRatio = 0.035;
}

export class GalaxyTheme extends PosterTheme {
  backgroundImage = images.galaxy;

  festivalNameTopRatio = 0.05;
  festivalNameColor = 'white';
  festivalNameFont = 'Cocogoose';

  artistFont = 'Monteral';
  artistColor = 'white';

  sideMarginRatio = 0.055;
  artistFontRatio = 0.02;
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
