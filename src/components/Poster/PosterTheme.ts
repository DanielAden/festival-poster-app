import {
  DEFAULT_BACKGROUND_IMAGE,
  fireworks,
  city,
  desert,
} from '../../images';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';

export abstract class PosterTheme {
  public backgroundImage: string = DEFAULT_BACKGROUND_IMAGE;
  public festivalNameColor: string = 'TexasTango';
  public festivalNameFont: string = 'serif';

  public artistFont: string = 'WesternBangBang';
  public artistColor: string = 'white';
  public textMargin: number = 0;
}

export class Theme1 extends PosterTheme {
  backgroundImage = fireworks;
  festivalNameColor = '#37C3E1';
  festivalNameFont = 'TexasTango';

  artistFont = 'WesternBangBang';
  artistColor = '#37C3E1';
}

export class Theme2 extends PosterTheme {
  backgroundImage = city;
  festivalNameColor = 'lime';
  festivalNameFont = 'TexasTango';

  artistFont = 'WesternBangBang';
  artistColor = 'lime';
}

export class DesertTheme extends PosterTheme {
  backgroundImage = desert;
  festivalNameColor = 'orange';
  festivalNameFont = 'TexasTango';

  artistFont = 'WesternBangBang';
  artistColor = 'orange';

  textMargin = 20;
}

export const usePosterTheme = (): PosterTheme => {
  const themeType = useTypedSelector(s => s.poster.themeType);
  const themeMemo = useMemo(() => {
    switch (themeType) {
      case 'theme1':
        return new Theme1();
      case 'theme2':
        return new Theme2();
      case 'desert':
        return new DesertTheme();
      default:
        throw new AppError(`Invalid theme ${themeType}`);
    }
  }, [themeType]);
  return themeMemo;
};
