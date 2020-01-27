import * as images from '../../images';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';

export interface PosterTextStrokeInfo {
  strokeStyle: string;
  widthRatio: number;
  offsetX: number;
  offsetY: number;
}

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

type StrokeInfo = PosterTextStrokeInfo | PosterTextStrokeInfo[];
export class PosterFontPackage {
  public strokeInfo: StrokeInfo;

  constructor(
    public fontType: string,
    public fontColor: string,
    public fontSizeRatio: number, // 0 to 1
    strokeInfo?: StrokeInfo,
  ) {
    this.strokeInfo = strokeInfo
      ? strokeInfo
      : {
          strokeStyle: 'black',
          widthRatio: 0.2,
          offsetX: 0,
          offsetY: 0,
        };
  }

  protected setStrokeCtx(
    ctx: CanvasRenderingContext2D,
    sinfo: PosterTextStrokeInfo,
  ) {
    ctx.strokeStyle = sinfo.strokeStyle;
    ctx.lineWidth = this.fontLineWidth(sinfo.widthRatio, ctx.canvas.height);
  }

  protected setTextCtx(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.fontColor;
  }

  public draw(
    str: string,
    x: number,
    y: number,
    maxWidth: number,
    ctx: CanvasRenderingContext2D,
  ) {
    const strokeList = Array.isArray(this.strokeInfo)
      ? this.strokeInfo
      : [this.strokeInfo];

    ctx.save();
    strokeList.forEach(sinfo => {
      this.setStrokeCtx(ctx, sinfo);
      ctx.strokeText(str, x + sinfo.offsetX, y + sinfo.offsetY, maxWidth);
    });
    ctx.restore();

    ctx.save();
    this.setTextCtx(ctx);
    ctx.fillText(str, x, y, maxWidth);
    ctx.restore();
  }

  public fontHeight(totalHeight: number) {
    return Math.floor(this.fontSizeRatio * totalHeight);
  }

  public fontString(totalHeight: number, scale = 1) {
    const fheight = this.fontHeight(totalHeight);
    return `${fheight * scale}px ${this.fontType}`;
  }

  public fontLineWidth(widthRatio: number, totalHeight: number): number {
    const lineWidth = widthRatio * this.fontHeight(totalHeight);
    return lineWidth;
  }

  private get maxStrokeRatio() {
    if (!this.strokeInfo) return 0;
    const siList = Array.isArray(this.strokeInfo)
      ? this.strokeInfo
      : [this.strokeInfo];
    let maxStrokeRatio = 0;
    siList.forEach(si => {
      maxStrokeRatio = Math.max(
        maxStrokeRatio,
        si.widthRatio + Math.abs(si.offsetY),
      );
    });
    return maxStrokeRatio;
  }

  public maxStrokeSize(totalHeight: number) {
    return this.maxStrokeRatio * this.fontHeight(totalHeight);
  }

  public lineHeight(totalHeight: number): number {
    const fontHeight = this.fontHeight(totalHeight);
    return fontHeight + this.maxStrokeSize(totalHeight);
  }
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
