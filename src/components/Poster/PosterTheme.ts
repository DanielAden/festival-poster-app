import * as images from '../../images';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';
import { PosterFontPackage } from './PosterFontPackage';

export abstract class PosterTheme {
  public backgroundImage: string = '';
  public sideMarginRatio: number = 0;
  public festivalNameTopRatio = 0.05;
  public artistTopRatio = 0.4;
  public skewText: boolean = false;
  public nameFontPackage: PosterFontPackage = new PosterFontPackage(
    'TexasTango',
    'white',
    0.03,
  );
  public artistFontPackage: PosterFontPackage = new PosterFontPackage(
    'WesternBangBang',
    'white',
    0.04,
  );
}

export class DesertTheme extends PosterTheme {
  backgroundImage = images.desert;
  sideMarginRatio = 0.03;
  artistTopRatio = 0.3;

  nameFontPackage = new PosterFontPackage('TexasTango', 'orange', 0.08);
  artistFontPackage = new PosterFontPackage('WesternBangBang', 'orange', 0.032);
}

export class PunkTheme extends PosterTheme {
  backgroundImage = images.punk;
  nameFontPackage = new PosterFontPackage('WesternBangBang', '#37C3E1', 0.1);
  artistFontPackage = new PosterFontPackage(
    'WesternBangBang',
    '#37C3E1',
    0.033,
  );
}

export class RockTheme extends PosterTheme {
  backgroundImage = images.metal;
  sideMarginRatio = 0.035;

  nameFontPackage = new PosterFontPackage('MadridGrunge', '#7C7170', 0.1);
  artistFontPackage = new PosterFontPackage(
    'PunkrockerStamp',
    '#7C7170',
    0.032,
  );
}

export class GalaxyTheme extends PosterTheme {
  backgroundImage = images.galaxy;
  festivalNameTopRatio = 0.05;

  artistFont = 'Monteral';
  artistColor = 'white';

  nameFontPackage = new PosterFontPackage('Cocogoose', 'white', 0.1, {
    widthRatio: 0.1,
    offsetX: 0,
    offsetY: 0,
    strokeStyle: 'black',
  });
  artistFontPackage = new PosterFontPackage('Monteral', 'white', 0.02);

  sideMarginRatio = 0.055;
}

export class TestTheme extends PosterTheme {
  backgroundImage = images.galaxy;

  festivalNameTopRatio = 0.05;
  sideMarginRatio = 0.055;

  nameFontPackage = new PosterFontPackage('Cocogoose', 'white', 0.1);
  artistFontPackage = new PosterFontPackage('Monteral', 'lime', 0.02, [
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
