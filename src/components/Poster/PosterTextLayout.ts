import { Poster } from './Poster';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';

export const usePosterLayout = (): PosterTextLayout => {
  const layoutType = useTypedSelector(s => s.poster.layoutType);
  let layout;
  switch (layoutType) {
    case 'basic':
      layout = new BasicLayout();
      break;
    case 'weekend':
      layout = new WeekendLayout();
      break;
    default:
      throw new AppError(`Invalid theme ${layoutType}`);
  }
  return layout;
};

export abstract class PosterTextLayout {
  protected artistTopRatio = 0.5;
  protected artistFontRatio: number = 0.025;

  protected festivalNameFontRatio: number = 0.1;

  constructor(private _poster?: Poster) {}

  public set poster(poster: Poster) {
    this._poster = poster;
  }

  public get poster() {
    if (!this._poster)
      throw new Error('Expected poster to be set before drawing');
    return this._poster;
  }

  public get ctx() {
    return this.poster.canvasCtx;
  }

  public get theme() {
    return this.poster.theme;
  }

  protected fontString(fontRatio: number, font: string) {
    return `${this.fontHeight(fontRatio)}px ${font}`;
  }

  protected fontHeight(size: number) {
    return Math.floor(size * this.poster.h);
  }

  protected cutTrailingChar(s: string) {
    return s.slice(0, s.length - 1);
  }

  protected get midX() {
    return Math.floor(this.posterWidth / 2);
  }

  protected get midY() {
    return Math.floor(this.posterHeight / 2);
  }

  protected get posterWidth() {
    return this.poster.w;
  }

  protected get posterHeight() {
    return this.poster.h;
  }

  protected artistLines() {
    const lines: string[] = [];
    const poster = this.poster;
    this.ctx.font = this.fontString(
      this.artistFontRatio,
      this.theme.artistFont,
    );
    let currentLine = '';
    for (let artist of this.poster.artistNames) {
      const lineWidth = Math.ceil(
        poster.canvasCtx.measureText(currentLine + artist).width,
      );
      if (lineWidth > this.posterWidth) {
        lines.push(this.cutTrailingChar(currentLine));
        currentLine = artist + poster.artistSeperator;
        continue;
      }
      currentLine = currentLine + artist + poster.artistSeperator;
    }
    if (currentLine !== '') lines.push(this.cutTrailingChar(currentLine));
    return lines;
  }

  public drawArtistBlock() {
    const ctx = this.poster.canvasCtx;
    const baseTop = this.posterHeight * this.artistTopRatio;
    const lines = this.artistLines();

    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle = this.theme.artistColor;

    const fh = this.fontHeight(this.artistFontRatio);
    lines.forEach((line, i) => {
      const top = baseTop + (i + 1) * fh;
      ctx.fillText(line, this.midX, top, this.posterWidth);
    });
  }

  public drawFestivalName() {
    const ctx = this.poster.canvasCtx;
    ctx.font = this.fontString(
      this.festivalNameFontRatio,
      this.theme.festivalNameFont,
    );
    ctx.fillStyle = this.theme.festivalNameColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    ctx.fillText(this.poster.festivalName, this.midX, 30);
    ctx.strokeText(this.poster.festivalName, this.midX, 30);
  }
}

export class BasicLayout extends PosterTextLayout {}
export class WeekendLayout extends PosterTextLayout {
  artistTopRatio = 0.4;
  artistFontRatio = 0.02;

  dayFont() {
    this.ctx.font = this.fontString(
      this.artistFontRatio * 2,
      this.theme.artistFont,
    );
  }

  artistFont() {
    this.ctx.font = this.fontString(
      this.artistFontRatio,
      this.theme.artistFont,
    );
  }

  drawArtistBlock() {
    const xStart = 3;
    const xRStart = this.posterWidth - xStart;
    const lines = this.artistLines();
    const oneThird = Math.ceil(lines.length / 3);
    const day1Lines = lines.slice(0, oneThird);
    const day2Lines = lines.slice(oneThird, oneThird * 2);
    const day3Lines = lines.slice(oneThird * 2);

    this.ctx.textBaseline = 'bottom';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = this.theme.artistColor;

    let top = this.posterHeight * this.artistTopRatio;
    const fh = this.fontHeight(this.artistFontRatio);

    this.dayFont();
    this.ctx.fillText('FRIDAY', 0, top);
    this.artistFont();

    day1Lines.forEach((line, i) => {
      top += fh;
      this.ctx.fillText(line, xStart, top, this.posterWidth);
    });

    top = top + fh * 3;
    this.ctx.textAlign = 'right';

    this.dayFont();
    this.ctx.fillText('SATURDAY', xRStart, top);
    this.artistFont();

    day2Lines.forEach((line, i) => {
      top += fh;
      this.ctx.fillText(line, xRStart, top, this.posterWidth);
    });

    top = top + fh * 3;
    this.ctx.textAlign = 'left';

    this.dayFont();
    this.ctx.fillText('SUNDAY', 5, top);
    this.artistFont();

    day3Lines.forEach((line, i) => {
      top += fh;
      this.ctx.fillText(line, xStart, top, this.posterWidth);
    });
  }
}
