import { Poster } from './Poster';
import { FontPackage, PosterTextStrokeInfo } from './FontPackage';

export class TextBox {
  public x: number = 0;
  public y: number = 0;
  public scale: number = 1;
  constructor(
    public text: string,
    public poster: Poster,
    public fontPkg: FontPackage,
  ) {}

  public setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  protected get drawX() {
    const { poster } = this;
    return this.x + this.strokeDeltaX(poster.h);
  }

  protected get drawY() {
    const { poster } = this;
    return this.y + this.strokeDeltaY(poster.h);
  }

  protected strokeLen(totalHeight: number) {
    if (!this.strokeInfo) return 0;
    return Math.floor(this.maxStrokeSize(totalHeight) / 2);
  }

  public strokeDeltaX(totalHeight: number) {
    if (offsetXStroke(this.fontPkg.fontType)) {
      return this.strokeLen(totalHeight);
    } else {
      return 0;
    }
  }

  public strokeDeltaY(totalHeight: number) {
    if (offsetYStroke(this.fontPkg.fontType)) {
      return this.strokeLen(totalHeight);
    } else {
      return 0;
    }
  }

  // Maybe no the best way to get the font height
  // but its a lot harder to do than you would think
  public fontHeight(totalHeight: number) {
    const { fontSizeRatio, fontType } = this.fontPkg;
    const el = document.createElement('div');
    el.style.font = `${fontSizeRatio * totalHeight}px ${fontType}`;
    el.innerText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const root = document.getElementById('root');
    if (!root) throw new Error('Could not get root element');
    root.appendChild(el);
    const height = el.getBoundingClientRect().height;
    el.remove();
    return height;
  }

  public fontString(totalHeight: number) {
    const fheight = this.fontHeight(totalHeight);
    return `${fheight}px ${this.fontPkg.fontType}`;
  }

  public get maxStrokeRatio() {
    return 1;
  }

  public maxStrokeSize(totalHeight: number) {
    return this.maxStrokeRatio * this.fontHeight(totalHeight);
  }

  protected get strokeInfo() {
    const { strokeInfo } = this.fontPkg;
    const strokeList = Array.isArray(strokeInfo) ? strokeInfo : [strokeInfo];
    return strokeList;
  }

  protected strokeLineSize(widthRatio: number, totalHeight: number): number {
    const lineWidth = widthRatio * this.fontHeight(totalHeight);
    return lineWidth;
  }

  protected setStrokeCtx(sinfo: PosterTextStrokeInfo) {
    // this.ctx.scale(scale, scale);
    const { ctx, poster } = this;
    ctx.font = this.fontString(poster.h);
    ctx.textBaseline = 'top';
    ctx.strokeStyle = sinfo.strokeStyle;
    ctx.lineWidth = this.strokeLineSize(sinfo.widthRatio, poster.h);
  }

  protected drawStroke() {
    const { ctx } = this;
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
    ctx.font = this.fontString(poster.h);
    ctx.textAlign = textAlign;
    ctx.fillStyle = fontPkg.fontColor;
  }

  public drawText() {
    const { ctx } = this;
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
    this.ctx.font = this.fontString(this.poster.h);
  }

  public get height() {
    return this.fontHeight(this.poster.h);
  }

  public get bottom(): number {
    return this.y + this.height;
  }

  public get right(): number {
    return this.x + this.width;
  }

  public get left() {
    return this.x;
  }

  public get width(): number {
    this.save();
    this.setTextCtx();
    const m = this.ctx.measureText(this.text);
    this.restore();
    return m.width;
  }

  public draw() {
    const { ctx } = this;
    ctx.save();
    // this.drawStroke();
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
