import { Poster } from './Poster';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';

interface ArtistBlockMetrics {
  top: number;
  bottom: number;
  height: number;
}

export abstract class PosterTextLayout {
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

  protected fontHeight(fontSizeRatio: number) {
    return Math.floor(fontSizeRatio * this.poster.h);
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

  protected get maxPosterWidth() {
    return this.posterWidth - this.sideMargin * 2;
  }

  protected get posterHeight() {
    return this.poster.h;
  }

  public get maxPosterHeight() {
    return this.posterHeight;
  }

  protected get sideMargin() {
    return Math.ceil(this.theme.sideMarginRatio * this.posterWidth);
  }

  protected get festivalNameTop() {
    return Math.floor(this.theme.festivalNameTopRatio * this.posterHeight);
  }

  public get artistTop() {
    return this.posterHeight * this.theme.artistTopRatio;
  }

  protected calculateTextWidth(...text: string[]) {
    const fullText = text.reduce((prev, cur) => prev + cur, '');
    const metrics = this.ctx.measureText(fullText);
    const marginWidth = this.sideMargin * 2;
    return Math.ceil(metrics.width) + marginWidth;
  }

  protected setArtistFont() {
    this.ctx.font = this.fontString(
      this.theme.artistFontRatio,
      this.theme.artistFont,
    );
  }

  protected artistLines() {
    const lines: string[] = [];
    const poster = this.poster;
    this.setArtistFont();

    let currentLine = '';
    for (let artist of this.poster.artistNames) {
      const lineWidth = this.calculateTextWidth(currentLine, artist);
      if (lineWidth > this.maxPosterWidth) {
        lines.push(this.cutTrailingChar(currentLine));
        currentLine = artist + poster.artistSeperator;
        continue;
      }
      currentLine = currentLine + artist + poster.artistSeperator;
    }
    if (currentLine !== '') lines.push(this.cutTrailingChar(currentLine));
    return lines;
  }

  public drawArtistBlock(artistTopOverride?: number): ArtistBlockMetrics {
    const ctx = this.poster.canvasCtx;
    const baseTop = artistTopOverride || this.artistTop;
    const lines = this.artistLines();

    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle = this.theme.artistColor;

    const fh = this.fontHeight(this.theme.artistFontRatio);
    let movingTop: number = 0;
    lines.forEach((line, i) => {
      movingTop = baseTop + (i + 1) * fh;
      this.printCenter(line, movingTop);
    });

    const bottom = movingTop + fh;

    return {
      top: baseTop,
      bottom,
      height: bottom - baseTop,
    };
  }

  public stroke(str: string, x: number, y: number, maxWidth?: number) {
    const { strokeStyle } = this.theme;
    if (!strokeStyle) return;
    const ctx = this.ctx;
    const fillStyle = ctx.fillStyle;
    const lineWidth = ctx.lineWidth;

    ctx.fillStyle = strokeStyle.fillStyle;
    ctx.lineWidth = strokeStyle.lineWidth;
    ctx.strokeText(str, x, y, maxWidth);

    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillStyle;
  }

  public printCenter(str: string, top: number) {
    const ctx = this.ctx;
    ctx.textAlign = 'center';
    this.stroke(str, this.midX, top, this.maxPosterWidth);
    ctx.fillText(str, this.midX, top, this.maxPosterWidth);
  }

  public printLeft(str: string, top: number) {
    const ctx = this.ctx;
    ctx.textAlign = 'left';
    this.stroke(str, this.sideMargin, top, this.maxPosterWidth);
    ctx.fillText(str, this.sideMargin, top, this.maxPosterWidth);
  }

  public printRight(str: string, top: number) {
    this.ctx.textAlign = 'right';
    this.stroke(
      str,
      this.posterWidth - this.sideMargin,
      top,
      this.maxPosterWidth,
    );
    this.ctx.fillText(
      str,
      this.posterWidth - this.sideMargin,
      top,
      this.maxPosterWidth,
    );
  }

  public drawFestivalName() {
    const ctx = this.poster.canvasCtx;
    ctx.font = this.fontString(
      this.theme.festivalNameFontRatio,
      this.theme.festivalNameFont,
    );
    ctx.fillStyle = this.theme.festivalNameColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    this.printCenter(this.poster.festivalName, this.festivalNameTop);
  }
}

export class BasicLayout extends PosterTextLayout {}
export class WeekendLayout extends PosterTextLayout {
  dayFont() {
    this.ctx.font = this.fontString(
      this.theme.artistFontRatio * 2,
      this.theme.artistFont,
    );
  }

  artistFont() {
    this.ctx.font = this.fontString(
      this.theme.artistFontRatio,
      this.theme.artistFont,
    );
  }

  drawArtistBlock(artistTopOverride?: number): ArtistBlockMetrics {
    const lines = this.artistLines();
    const oneThird = Math.ceil(lines.length / 3);
    const day1Lines = lines.slice(0, oneThird);
    const day2Lines = lines.slice(oneThird, oneThird * 2);
    const day3Lines = lines.slice(oneThird * 2);

    this.ctx.textBaseline = 'bottom';
    this.ctx.fillStyle = this.theme.artistColor;

    const fh = this.fontHeight(this.theme.artistFontRatio);
    const startTop = artistTopOverride || this.artistTop;
    const actualTop = startTop - fh;
    let movingTop = startTop;

    this.dayFont();
    this.printLeft('FRIDAY', movingTop);
    this.artistFont();

    day1Lines.forEach((line, i) => {
      movingTop += fh;
      this.printLeft(line, movingTop);
    });

    movingTop = movingTop + fh * 3;

    this.dayFont();
    this.printRight('SATURDAY', movingTop);
    this.artistFont();

    day2Lines.forEach((line, i) => {
      movingTop += fh;
      this.printRight(line, movingTop);
    });

    movingTop = movingTop + fh * 3;
    this.ctx.textAlign = 'left';

    this.dayFont();
    this.printLeft('SUNDAY', movingTop);
    this.artistFont();
    day3Lines.forEach(line => {
      movingTop += fh;
      this.printLeft(line, movingTop);
    });
    return {
      top: actualTop,
      bottom: movingTop,
      height: movingTop - actualTop,
    };
  }
}

export const usePosterLayout = (): PosterTextLayout => {
  const layoutType = useTypedSelector(s => s.poster.layoutType);
  const layoutMeme = useMemo(() => {
    switch (layoutType) {
      case 'basic':
        return new BasicLayout();
      case 'weekend':
        return new WeekendLayout();
      default:
        throw new AppError(`Invalid theme ${layoutType}`);
    }
  }, [layoutType]);
  return layoutMeme;
};
