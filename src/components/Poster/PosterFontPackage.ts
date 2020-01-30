export interface PosterTextStrokeInfo {
  strokeStyle: string;
  widthRatio: number;
  offsetX: number;
  offsetY: number;
}

type StrokeInfo = PosterTextStrokeInfo | PosterTextStrokeInfo[];
export default class FontPkg {
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

  protected setTextCtx(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fontColor;
  }

  public fontHeight(totalHeight: number) {
    return this.fontSizeRatio * totalHeight;
  }

  public fontString(totalHeight: number) {
    const fheight = this.fontHeight(totalHeight);
    return `${fheight}px ${this.fontType}`;
  }

  protected get maxStrokeRatio() {
    if (!this.strokeInfo) return 0;
    const siList = Array.isArray(this.strokeInfo)
      ? this.strokeInfo
      : [this.strokeInfo];
    let maxStrokeRatio = 1;
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

export class BasicFontPkg extends FontPkg {}
