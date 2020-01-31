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

  protected get drawX() {
    const { poster, fontPkg } = this;
    return this.x + fontPkg.strokeDeltaX(poster.h);
  }

  protected get drawY() {
    const { poster, fontPkg } = this;
    return this.y + fontPkg.strokeDeltaY(poster.h);
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

  protected setStrokeCtx(sinfo: PosterTextStrokeInfo) {
    // this.ctx.scale(scale, scale);
    const { ctx, fontPkg, poster } = this;
    ctx.font = fontPkg.fontString(poster.h);
    ctx.textBaseline = 'top';
    ctx.strokeStyle = sinfo.strokeStyle;
    ctx.lineWidth = this.strokeLineSize(sinfo.widthRatio, poster.h);
  }

  protected drawStroke() {
    const { poster, ctx } = this;
    this.save();
    this.strokeInfo.forEach(sinfo => {
      // this.setStrokeCtx(sinfo, poster.h, this.scale);
      this.setStrokeCtx(sinfo);
      ctx.strokeText(this.text, this.drawX, this.drawY);
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
    ctx.fillText(this.text, this.drawX, this.drawY); // poster.maxWidth);
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

  public get bottom(): number {
    return this.y + this.fontPkg.lineHeight(this.poster.h);
  }

  public get right(): number {
    return this.x + this.width;
  }

  public get left() {
    return this.x;
  }

  public get width(): number {
    const { fontPkg, poster } = this;
    this.save();
    this.setTextCtx();
    const m = this.ctx.measureText(this.text);
    this.restore();
    return m.width;
  }

  public draw() {
    const { ctx } = this;
    ctx.save();
    this.drawStroke();
    this.drawText();
    ctx.restore();
    return this;
  }

  public box(boxLineWidth = 3, strokeStyle = 'red') {
    const { ctx } = this;
    ctx.save();
    ctx.lineWidth = boxLineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.strokeRect(
      this.x,
      this.y - boxLineWidth,
      this.width,
      this.height + boxLineWidth * 2,
    );
    ctx.restore();
  }

  public drawBelow(tb: TextBox) {
    tb.y = this.y + this.height;
    tb.draw();
  }
}
