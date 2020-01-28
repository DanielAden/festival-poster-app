import * as images from '../../images';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';
import FontPkg, { BasicFontPkg } from './PosterFontPackage';

export abstract class PosterTheme {
  public backgroundImage: string = '';
  public sideMarginRatio: number = 0;
  public festivalNameTopRatio = 0.05;
  public artistTopRatio = 0.4;
  public skewText: boolean = false;
  public abstract nameFontPkg: FontPkg;
  public abstract artistFontPkg: FontPkg;
  public abstract dateFontPkg: FontPkg;
}

export class DesertTheme extends PosterTheme {
  backgroundImage = images.desert;
  sideMarginRatio = 0.03;
  artistTopRatio = 0.3;

  nameFontPkg = new BasicFontPkg('TexasTango', 'orange', 0.08);
  artistFontPkg = new BasicFontPkg('WesternBangBang', 'orange', 0.032);
  dateFontPkg = new BasicFontPkg('WesternBangBang', 'orange', 0.032);
}

export class PunkTheme extends PosterTheme {
  backgroundImage = images.punk;
  nameFontPkg = new BasicFontPkg('WesternBangBang', '#37C3E1', 0.1);
  artistFontPkg = new BasicFontPkg('WesternBangBang', '#37C3E1', 0.033);
  dateFontPkg = new BasicFontPkg('WesternBangBang', '#37C3E1', 0.033);
}

export class RockTheme extends PosterTheme {
  backgroundImage = images.metal;
  sideMarginRatio = 0.035;

  nameFontPkg = new BasicFontPkg('MadridGrunge', '#7C7170', 0.1);
  artistFontPkg = new BasicFontPkg('PunkrockerStamp', '#7C7170', 0.032);
  dateFontPkg = new BasicFontPkg('PunkrockerStamp', '#7C7170', 0.032);
}

export class GalaxyTheme extends PosterTheme {
  backgroundImage = images.galaxy;
  festivalNameTopRatio = 0.05;

  artistFont = 'Monteral';
  artistColor = 'white';

  nameFontPkg = new BasicFontPkg('Cocogoose', 'white', 0.1, {
    widthRatio: 0.1,
    offsetX: 0,
    offsetY: 0,
    strokeStyle: 'black',
  });
  artistFontPkg = new BasicFontPkg('Monteral', 'white', 0.02);
  dateFontPkg = new BasicFontPkg('Monteral', 'white', 0.02);

  sideMarginRatio = 0.055;
}

export class TestTheme extends PosterTheme {
  backgroundImage = images.galaxy;

  festivalNameTopRatio = 0.05;
  sideMarginRatio = 0.055;

  nameFontPkg = new BasicFontPkg('Cocogoose', 'white', 0.1);
  artistFontPkg = new BasicFontPkg('Monteral', 'lime', 0.02, [
    {
      strokeStyle: 'yellow',
      widthRatio: 0.4,
      offsetX: 0,
      offsetY: 0,
    },
    {
      strokeStyle: 'blue',
      widthRatio: 0.2,
      offsetX: 0,
      offsetY: 0,
    },
  ]);

  dateFontPkg = this.artistFontPkg;
  skewText = true;
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
      case 'test':
        return new TestTheme();
      default:
        throw new AppError(`Invalid theme ${themeType}`);
    }
  }, [themeType]);
  return themeMemo;
};
