export interface PosterTextStrokeInfo {
  strokeStyle: string;
  widthRatio: number;
  offsetX: number;
  offsetY: number;
}

export const offsetXStroke = (fontTYpe: string) => {
  switch (fontTYpe) {
    case 'MadridGrunge':
    case 'WesternBangBang':
    case 'TexasTango':
      return true;
    case 'Monteral':
    case 'Cocogoose':
    case 'PunkrockerStamp':
    default:
      return false;
  }
};

export const offsetYStroke = (fontTYpe: string) => {
  switch (fontTYpe) {
    case 'MadridGrunge':
      return true;
    case 'TexasTango':
    case 'WesternBangBang':
    case 'PunkrockerStamp':
    case 'Monteral':
    case 'Cocogoose':
    default:
      return false;
  }
};

type StrokeInfo = PosterTextStrokeInfo | PosterTextStrokeInfo[];
export default class FontPkg {
  public strokeInfo: StrokeInfo;

  constructor(
    public fontType: string,
    public fontColor: string,
    public fontSizeRatio: number,
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

  protected strokeLen(totalHeight: number) {
    if (!this.strokeInfo) return 0;
    return Math.floor(this.maxStrokeSize(totalHeight) / 2);
  }

  public strokeDeltaX(totalHeight: number) {
    if (offsetXStroke(this.fontType)) {
      return this.strokeLen(totalHeight);
    } else {
      return 0;
    }
  }

  public strokeDeltaY(totalHeight: number) {
    if (offsetYStroke(this.fontType)) {
      return this.strokeLen(totalHeight);
    } else {
      return 0;
    }
  }

  // Maybe no the best way to get the font height
  // but its a lot harder to do than you would think
  public fontHeight(totalHeight: number) {
    const el = document.createElement('div');
    el.style.font = `${this.fontSizeRatio * totalHeight}px ${this.fontType}`;
    el.innerText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    document.getElementById('root')?.appendChild(el);
    const height = el.getBoundingClientRect().height;
    el.remove();
    return height;
  }

  public fontString(totalHeight: number) {
    const fheight = this.fontHeight(totalHeight);
    return `${fheight}px ${this.fontType}`;
  }

  public get maxStrokeRatio() {
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
    return fontHeight + this.strokeLen(totalHeight);
  }
}

export class BasicFontPkg extends FontPkg {}
