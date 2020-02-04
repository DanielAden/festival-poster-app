import * as images from '../../images';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';
import { FontPackage } from './FontPackage';

export abstract class PosterTheme {
  public backgroundImage: string = '';
  public sideMarginRatio: number = 0;
  public festivalNameTopRatio = 0.05;
  public artistTopRatio = 0.4;
  public abstract nameFontPkg: FontPackage;
  public abstract artistFontPkg: FontPackage;
  public abstract dateFontPkg: FontPackage;
}

export class DesertTheme extends PosterTheme {
  backgroundImage = images.desert;
  sideMarginRatio = 0.03;
  artistTopRatio = 0.3;

  nameFontPkg = {
    fontType: 'TexasTango',
    fontColor: 'orange',
    fontSizeRatio: 0.08,
  };
  artistFontPkg = {
    fontType: 'WesternBangBang',
    fontColor: 'orange',
    fontSizeRatio: 0.032,
  };
  dateFontPkg = {
    fontType: 'WesternBangBang',
    fontColor: 'orange',
    fontSizeRatio: 0.032,
  };
}

export class PunkTheme extends PosterTheme {
  backgroundImage = images.punk;
  nameFontPkg = {
    fontType: 'TexasTango',
    fontColor: '#37C3E1',
    fontSizeRatio: 0.01,
  };
  artistFontPkg = {
    fontType: 'WesternBangBang',
    fontColor: '#37C3E1',
    fontSizeRatio: 0.033,
  };
  dateFontPkg = {
    fontType: 'WesternBangBang',
    fontColor: '#37C3E1',
    fontSizeRatio: 0.033,
  };
}

export class RockTheme extends PosterTheme {
  backgroundImage = images.metal;
  sideMarginRatio = 0.035;
  nameFontPkg = {
    fontType: 'MadridGrunge',
    fontColor: '#7C7170',
    fontSizeRatio: 0.05,
  };
  artistFontPkg = {
    fontType: 'PunkrockerStamp',
    fontColor: '#7C7170',
    fontSizeRatio: 0.033,
  };
  dateFontPkg = {
    fontType: 'PunkrockerStamp',
    fontColor: '#7C7170',
    fontSizeRatio: 0.033,
  };
}

export class GalaxyTheme extends PosterTheme {
  backgroundImage = images.galaxy;
  festivalNameTopRatio = 0.05;

  nameFontPkg = {
    fontType: 'Cocogoose',
    fontColor: 'white',
    fontSizeRatio: 0.01,
  };
  artistFontPkg = {
    fontType: 'Monteral',
    fontColor: 'white',
    fontSizeRatio: 0.02,
  };
  dateFontPkg = {
    fontType: 'Monteral',
    fontColor: 'white',
    fontSizeRatio: 0.02,
  };

  sideMarginRatio = 0.055;
}

export class TestTheme extends PosterTheme {
  backgroundImage = images.galaxy;
  festivalNameTopRatio = 0.05;

  nameFontPkg = {
    fontType: 'Cocogoose',
    fontColor: 'white',
    fontSizeRatio: 0.03,
    strokeInfo: {
      strokeStyle: 'black',
      widthRatio: 0.5,
    },
  };
  artistFontPkg = {
    fontType: 'Monteral',
    fontColor: 'white',
    fontSizeRatio: 0.02,
  };
  dateFontPkg = {
    fontType: 'Monteral',
    fontColor: 'white',
    fontSizeRatio: 0.02,
  };

  sideMarginRatio = 0.055;
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
