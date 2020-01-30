import FontPkg, { PosterTextStrokeInfo } from './PosterFontPackage';
import { Poster } from './Poster';

export class TextBox {
  public x: number = 0;
  public y: number = 0;
  public scale: number = 1;
  constructor(
    public text: string,
    public poster: Poster,
    public fontPkg: FontPkg,
  ) {}

  public setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public draw() {
    const { ctx } = this;
    ctx.save();
    this.drawStroke();
    this.drawText();
    ctx.restore();
  }

  protected get strokeInfo() {
    const { strokeInfo } = this.fontPkg;
    const strokeList = Array.isArray(strokeInfo) ? strokeInfo : [strokeInfo];
    return strokeList;
  }

  protected strokeLineSize(widthRatio: number, totalHeight: number): number {
    const { fontPkg } = this;
    const lineWidth = widthRatio * fontPkg.fontHeight(totalHeight);
    return lineWidth;
  }

  protected setStrokeCtx(
    sinfo: PosterTextStrokeInfo,
    totalHeight: number,
    // scale: number,
  ) {
    // this.ctx.scale(scale, scale);
    const { ctx, fontPkg, poster } = this;
    ctx.font = fontPkg.fontString(poster.h);
    ctx.textBaseline = 'top';
    ctx.strokeStyle = sinfo.strokeStyle;
    ctx.lineWidth = this.strokeLineSize(sinfo.widthRatio, totalHeight);
  }

  protected drawStroke() {
    const { poster, ctx } = this;
    this.save();
    this.strokeInfo.forEach(sinfo => {
      // this.setStrokeCtx(sinfo, poster.h, this.scale);
      this.setStrokeCtx(sinfo, poster.h);
      ctx.strokeText(
        this.text,
        this.x + sinfo.offsetX,
        this.y + sinfo.offsetY,
        poster.maxWidth,
      );
    });
    this.restore();
  }

  protected setTextCtx(textAlign: CanvasTextAlign = 'left') {
    const { ctx, poster, fontPkg } = this;
    // ctx.scale(this.scale, this.scale);
    ctx.textBaseline = 'top';
    ctx.font = fontPkg.fontString(poster.h);
    ctx.textAlign = textAlign;
    ctx.fillStyle = fontPkg.fontColor;
  }

  public drawText() {
    const { ctx, poster } = this;
    this.save();
    this.setTextCtx();
    ctx.fillText(this.text, this.x, this.y, poster.maxWidth);
    this.restore();
  }

  protected get ctx() {
    return this.poster.canvasCtx;
  }

  protected save() {
    this.ctx.save();
  }

  protected restore() {
    this.ctx.restore();
  }

  protected setup() {
    this.ctx.font = this.fontPkg.fontString(this.poster.h);
  }

  public get height() {
    return this.fontPkg.lineHeight(this.poster.h);
  }

  public get metrics() {
    this.ctx.save();
    this.setup();
    const _metrics = this.ctx.measureText(this.text);
    this.ctx.restore();
    return {
      width: _metrics.width,
      height: this.height,
    };
  }
}
