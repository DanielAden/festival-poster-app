import { Poster } from './Poster';
import { FontPackage, PosterTextStrokeInfo } from './FontPackage';

export class TextBox {
  public x: number = 0;
  public y: number = 0;
  public _scale: number = 1;
  public textAlign: 'left' | 'center' | 'right' = 'left';
  constructor(
    public text: string,
    public poster: Poster,
    public fontPkg: FontPackage,
  ) {}

  public setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public scale(scaleRatio: number) {
    this._scale = scaleRatio;
    return this;
  }

  // protected get drawX() {
  //   const { poster } = this;
  //   return this.x + this.strokeDeltaX(poster.h);
  // }

  // protected get drawY() {
  //   const { poster } = this;
  //   return this.y + this.strokeDeltaY(poster.h);
  // }

  // public strokeDeltaX(totalHeight: number) {
  //   if (offsetXStroke(this.fontPkg.fontType)) {
  //     return this.strokeLen(totalHeight);
  //   } else {
  //     return 0;
  //   }
  // }

  // public strokeDeltaY(totalHeight: number) {
  //   if (offsetYStroke(this.fontPkg.fontType)) {
  //     return this.strokeLen(totalHeight);
  //   } else {
  //     return 0;
  //   }
  // }

  // X Y coords incorporating the line width of the stroke
  protected get textDrawCoords() {
    const strokeDelta = this.strokeDelta;
    return [this.x + strokeDelta, this.y + strokeDelta];
  }

  protected get strokeDrawCoords() {
    const strokeDelta = this.strokeDelta;
    return [this.x + strokeDelta, this.y + strokeDelta];
  }

  protected get boxDrawCoords() {
    return [this.x, this.y];
  }

  // Maybe no the best way to get the font height
  // but its a lot harder to do than you would think
  // TODO make this element permanent so it doesn't get recreated
  public fontHeight(totalHeight: number) {
    const { fontSizeRatio, fontType } = this.fontPkg;
    const el = document.createElement('div');
    el.style.font = `${fontSizeRatio * totalHeight}px ${fontType}`;
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    el.style.height = 'auto';
    el.style.width = 'auto';
    el.style.whiteSpace = 'nowrap';
    el.innerText = this.text;
    const root = document.getElementById('root');
    if (!root) throw new Error('Could not get root element');
    root.appendChild(el);
    const height = el.getBoundingClientRect().height;
    el.remove();
    return height * this._scale;
  }

  public fontString(totalHeight: number) {
    const fheight = this.fontHeight(totalHeight);
    return `${fheight}px ${this.fontPkg.fontType}`;
  }

  protected strokeLineSize(strokeInfo: PosterTextStrokeInfo) {
    return strokeInfo.widthRatio * this.fontHeight(this.poster.h);
  }

  protected setStrokeCtx(strokeInfo: PosterTextStrokeInfo) {
    // this.ctx.scale(scale, scale);
    const { ctx, poster } = this;
    ctx.font = this.fontString(poster.h);
    ctx.strokeStyle = strokeInfo.strokeStyle;
    ctx.textAlign = this.textAlign;
    ctx.lineWidth = this.strokeLineSize(strokeInfo);
  }

  protected get strokeDelta() {
    if (!this.fontPkg.strokeInfo) return 0;
    const size = this.strokeLineSize(this.fontPkg.strokeInfo);
    return size / 2;
  }

  protected drawStroke() {
    const { ctx } = this;
    const { strokeInfo } = this.fontPkg;
    const [x, y] = this.strokeDrawCoords;
    if (!strokeInfo) return;
    this.save();
    this.setStrokeCtx(strokeInfo);
    ctx.strokeText(this.text, x, y);
    this.restore();
  }

  protected setTextCtx() {
    const { ctx, poster, fontPkg, textAlign } = this;
    // ctx.scale(this.scale, this.scale);
    ctx.textBaseline = 'top';
    ctx.font = this.fontString(poster.h);
    ctx.textAlign = textAlign;
    ctx.fillStyle = fontPkg.fontColor;
  }

  protected drawText() {
    const { ctx } = this;
    const [x, y] = this.textDrawCoords;
    this.save();
    this.setTextCtx();
    ctx.fillText(this.text, x, y); // poster.maxWidth);
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
    return this.fontHeight(this.poster.h) + this.strokeDelta * 2;
  }

  public get bottom(): number {
    return this.y + this.height;
  }

  public get right(): number {
    return this.x + this.width;
  }

  public get left() {
    if (this.textAlign === 'center') {
      return this.x - this.width / 2;
    } else {
      return this.x;
    }
  }

  public get width(): number {
    this.save();
    this.setTextCtx();
    const m = this.ctx.measureText(this.text);
    this.restore();
    return m.width + this.strokeDelta * 2;
  }

  public draw() {
    const { ctx } = this;
    ctx.save();
    ctx.textBaseline = 'top';
    this.drawStroke();
    this.drawText();
    ctx.restore();
    return this;
  }

  public box(boxLineWidth = 3, strokeStyle = 'red') {
    const { ctx } = this;
    const [x, y] = this.boxDrawCoords;
    ctx.save();
    ctx.lineWidth = boxLineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.strokeRect(x, y, this.width, this.height);
    ctx.restore();
  }

  public drawBelow(tb: TextBox) {
    tb.y = this.bottom;
    tb.x = this.left;
    tb.draw();
  }

  public drawAbove(tb: TextBox) {
    tb.y = this.y - tb.height;
    tb.x = this.left;
    tb.draw();
    return tb;
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
