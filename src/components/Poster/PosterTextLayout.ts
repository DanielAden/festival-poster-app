import { Poster } from './Poster';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';

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
    ctx.font = this.fontString(this.artistFontRatio, this.theme.artistFont);
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
export class WeekendLayout extends PosterTextLayout {}

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
