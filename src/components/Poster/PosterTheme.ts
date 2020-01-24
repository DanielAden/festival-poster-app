import {
  DEFAULT_BACKGROUND_IMAGE,
  fireworks,
  city,
  desert,
} from '../../images';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';

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
  let theme;
  switch (themeType) {
    case 'theme1':
      theme = new Theme1();
      break;
    case 'theme2':
      theme = new Theme2();
      break;
    case 'desert':
      theme = new DesertTheme();
      break;
    default:
      throw new AppError(`Invalid theme ${themeType}`);
  }
  return theme;
};
