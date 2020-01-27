export interface PosterTextStrokeInfo {
  strokeStyle: string;
  widthRatio: number;
  offsetX: number;
  offsetY: number;
}

type StrokeInfo = PosterTextStrokeInfo | PosterTextStrokeInfo[];
export default class FontPkg {
  protected strokeInfo: StrokeInfo;

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
    totalHeight: number,
  ) {
    ctx.strokeStyle = sinfo.strokeStyle;
    ctx.lineWidth = this.fontLineWidth(sinfo.widthRatio, totalHeight);
  }

  protected setTextCtx(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fontColor;
  }

  public draw(
    str: string,
    x: number,
    y: number,
    maxWidth: number,
    ctx: CanvasRenderingContext2D,
    totalHeight: number,
  ) {
    const strokeList = Array.isArray(this.strokeInfo)
      ? this.strokeInfo
      : [this.strokeInfo];

    ctx.save();
    strokeList.forEach(sinfo => {
      this.setStrokeCtx(ctx, sinfo, totalHeight);
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

export class BasicFontPkg extends FontPkg {}
