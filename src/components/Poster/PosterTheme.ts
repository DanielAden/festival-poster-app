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
  public festivalNameColor: string = 'white';
  public festivalNameFont: string = 'serif';

  public artistFont: string = 'serif';
  public artistColor: string = 'white';
}

export class Theme1 extends PosterTheme {
  backgroundImage = fireworks;
  festivalNameColor = '#37C3E1';
  festivalNameFont = 'serif';

  artistFont = 'serif';
  artistColor = '#37C3E1';
}

export class Theme2 extends PosterTheme {
  backgroundImage = city;
  festivalNameColor = 'lime';
  festivalNameFont = 'serif';

  artistFont = 'serif';
  artistColor = 'lime';
}

export class DesertTheme extends PosterTheme {
  backgroundImage = desert;
  festivalNameColor = 'orange';
  festivalNameFont = 'TexasTango';

  artistFont = 'TexasTango';
  artistColor = 'orange';
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
