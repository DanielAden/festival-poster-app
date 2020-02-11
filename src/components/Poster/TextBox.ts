import { Poster } from './Poster';
import { FontPackage, PosterTextStrokeInfo } from './FontPackage';

type AlignType = 'left' | 'center' | 'right';
export abstract class TextBox {
  public _x: number = 0;
  public _y: number = 0;
  public _scale: number = 1;
  public textAlign: AlignType = 'left';
  public seperator: string = ' ';
  constructor(
    public text: string | string[],
    public poster: Poster,
    public fontPkg: FontPackage,
  ) {}

  public abstract draw(): void;
  public abstract get height(): number;
  public abstract get bottom(): number;
  public abstract get right(): number;
  public abstract get left(): number;
  public abstract get width(): number;
  public abstract get drawableText(): string;

  public get x() {
    return this._x;
  }

  public set x(newX: number) {
    const { poster } = this;
    this._x = Math.max(poster.minLeft, newX);
  }

  public get y() {
    return this._y;
  }

  public set y(newY: number) {
    this._y = Math.max(0, newY);
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

  public drawBelow(tb: TextBox, alignX: boolean = true) {
    tb.y = this.bottom;
    if (alignX && this.textAlign !== 'center') tb.x = this.left;
    tb.draw();
  }

  public drawAbove(tb: TextBox, alignX: boolean = true) {
    tb.y = this.y - tb.height;
    if (alignX && this.textAlign !== 'center') tb.x = this.left;
    tb.draw();
    return tb;
  }

  public pushText(text: string) {
    if (!Array.isArray(this.text))
      throw new Error('can only push to text array');
    this.text.push(text);
  }

  public popText() {
    if (!Array.isArray(this.text))
      throw new Error('can only pop from text array');
    this.text.pop();
  }

  public setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  public align(newAlign: AlignType) {
    this.textAlign = newAlign;
    if (newAlign === 'right') {
      this.x = this.poster.maxRight;
    } else if (newAlign === 'left') {
      this.x = this.poster.minLeft;
    } else {
      this.x = this.poster.midX;
    }
    return this;
  }

  public scale(scaleRatio: number) {
    this._scale = scaleRatio;
    return this;
  }

  protected strokeLineSize(strokeInfo: PosterTextStrokeInfo) {
    return strokeInfo.widthRatio * this.fontHeight(this.poster.h);
  }

  protected get strokeDelta() {
    if (!this.fontPkg.strokeInfo) return 0;
    const size = this.strokeLineSize(this.fontPkg.strokeInfo);
    return size / 2;
  }

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
    el.innerText = this.drawableText;
    const root = document.getElementById('root');
    if (!root) throw new Error('Could not get root element');
    root.appendChild(el);
    const height = el.getBoundingClientRect().height;
    el.remove();
    return height * this._scale;
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
}

export class TextBoxLine extends TextBox {
  public fontString(totalHeight: number) {
    const fheight = this.fontHeight(totalHeight);
    return `${fheight}px ${this.fontPkg.fontType}`;
  }

  protected setStrokeCtx(strokeInfo: PosterTextStrokeInfo) {
    // this.ctx.scale(scale, scale);
    const { ctx, poster } = this;
    ctx.font = this.fontString(poster.h);
    ctx.strokeStyle = strokeInfo.strokeStyle;
    ctx.textAlign = this.textAlign;
    ctx.lineWidth = this.strokeLineSize(strokeInfo);
  }

  protected drawStroke() {
    const { ctx } = this;
    const { strokeInfo } = this.fontPkg;
    const [x, y] = this.strokeDrawCoords;
    if (!strokeInfo) return;
    this.save();
    this.setStrokeCtx(strokeInfo);
    ctx.strokeText(this.drawableText, x, y);
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
    ctx.fillText(this.drawableText, x, y); // poster.maxWidth);
    this.restore();
  }

  public get drawableText(): string {
    const { text, seperator } = this;
    if (typeof text === 'string') return text;
    return text.join(seperator);
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
    const m = this.ctx.measureText(this.drawableText);
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
}

export class MultilineTextBox extends TextBox {
  protected lines: TextBoxLine[] = [];

  constructor(
    public text: string | string[],
    public poster: Poster,
    public fontPkg: FontPackage,
  ) {
    super(text, poster, fontPkg);
    this.setLines(text);
  }

  private alignAll() {
    const { textAlign } = this;
    this.lines.forEach(l => {
      l.align(textAlign);
    });
    return this;
  }

  private initEmptyTextBoxLine(): TextBoxLine {
    return new TextBoxLine([], this.poster, this.fontPkg);
  }

  private setLines(text: string | string[]) {
    const { poster } = this;
    let line = this.initEmptyTextBoxLine();
    if (typeof text === 'string') {
      line.text = [text];
      this.lines.push(line);
      return;
    }
    for (let str of text) {
      line.pushText(str);
      if (line.width > poster.maxWidth) {
        line.popText();
        this.lines.push(line);
        line = this.initEmptyTextBoxLine();
        line.pushText(str);
      }
    }
    this.lines.push(line);
  }

  public get drawableText(): string {
    const { text, seperator } = this;
    if (typeof text === 'string') return text;
    return text.join(seperator);
  }

  public get height() {
    let h = 0;
    this.lines.forEach(l => {
      h += l.height;
    });
    return h;
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
    if (this.lines.length === 0) return 0;
    let maxW = -Infinity;
    this.lines.forEach(l => {
      maxW = Math.max(l.width, maxW);
    });
    return maxW;
  }

  public draw() {
    const { lines, x, y } = this;
    this.alignAll();
    if (lines.length === 0) return;
    let lastLine = lines[0];
    lastLine.setXY(x, y);
    lastLine.draw();
    this.lines.slice(1).forEach(line => {
      lastLine.drawBelow(line);
      lastLine = line;
    });
  }
}
