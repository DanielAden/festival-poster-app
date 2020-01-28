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
    ctx.save();
    this.setup();
    ctx.textAlign = textAlign;
    fontPkg.draw(text, x, y, 10000, ctx, poster.h);
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
    console.log(this.ctx.font);
  }

  public get metrics() {
    this.ctx.save();
    const _metrics = this.ctx.measureText(this.text);
    this.ctx.restore();
    return {
      width: _metrics.width,
      heigth: this.fontPkg.fontHeight(this.poster.h),
    };
  }
}
