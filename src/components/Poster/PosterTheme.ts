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

export class MetalTheme extends PosterTheme {
  backgroundImage = images.metal;
  festivalNameColor = 'lime';
  festivalNameFont = 'TexasTango';

  artistFont = 'WesternBangBang';
  artistColor = 'lime';
}

export const usePosterTheme = (): PosterTheme => {
  const themeType = useTypedSelector(s => s.poster.themeType);
  const themeMemo = useMemo(() => {
    switch (themeType) {
      case 'punk':
        return new PunkTheme();
      case 'metal':
        return new MetalTheme();
      case 'desert':
        return new DesertTheme();
      default:
        throw new AppError(`Invalid theme ${themeType}`);
    }
  }, [themeType]);
  return themeMemo;
};
