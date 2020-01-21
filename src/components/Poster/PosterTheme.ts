import { DEFAULT_BACKGROUND_IMAGE, fireworks, city } from '../../images';
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
  festivalNameColor = 'lightblue';
  festivalNameFont = 'serif';

  artistFont = 'serif';
  artistColor = 'tomato';
}

export class Theme2 extends PosterTheme {
  backgroundImage = city;
  festivalNameColor = 'lime';
  festivalNameFont = 'serif';

  artistFont = 'serif';
  artistColor = 'lime';
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
    default:
      throw new AppError(`Invalid theme ${themeType}`);
  }
  return theme;
};
