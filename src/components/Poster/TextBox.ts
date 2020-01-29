import FontPkg from './PosterFontPackage';
import { Poster } from './Poster';

export class TextBox {
  public x!: number;
  public y!: number;
  public scale: number = 1;
  constructor(
    public ctx: CanvasRenderingContext2D,
    public poster: Poster,
    public text: string,
    public fontPkg: FontPkg,
  ) {}

  public draw(
    x: number,
    y: number,
    textAlign: 'left' | 'center' | 'right' = 'left',
  ) {
    const { ctx, fontPkg, poster, text } = this;
    const left = x < poster.maxLeft ? poster.maxLeft : x;
    ctx.save();
    this.setup();
    ctx.textAlign = textAlign;
    fontPkg.draw(text, left, y, 10000, ctx, poster.h, this.scale);
    ctx.restore();
  }

  public drawLeft(y: number) {
    const { poster } = this;
    this.draw(poster.maxLeft, y, 'left');
  }

  public drawRight(y: number) {
    const { poster } = this;
    this.draw(poster.maxRight, y, 'right');
  }

  protected setup() {
    this.ctx.font = this.fontPkg.fontString(this.poster.h, this.scale);
  }

  public get lineHeight() {
    return this.fontPkg.fontHeight(this.poster.h) * this.scale;
  }

  public get metrics() {
    this.ctx.save();
    this.setup();
    const _metrics = this.ctx.measureText(this.text);
    this.ctx.restore();
    return {
      width: _metrics.width,
      height: this.lineHeight,
    };
  }
}
