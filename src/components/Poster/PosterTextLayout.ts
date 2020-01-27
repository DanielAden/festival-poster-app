import { Poster } from './Poster';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';
import FontPkg from './PosterFontPackage';

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

  public fontPkg(type: 'artist' | 'name') {
    switch (type) {
      case 'artist':
        return this.theme.artistFontPackage;
      case 'name':
        return this.theme.nameFontPackage;
    }
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

  protected calculateTextWidth(fp: FontPkg, ...text: string[]) {
    const fullText = text.reduce((prev, cur) => prev + cur, '');
    const metrics = this.ctx.measureText(fullText);
    return Math.ceil(metrics.width + fp.maxStrokeSize(this.posterHeight) * 2);
  }

  protected setArtistFont() {
    this.ctx.font = this.fontPkg('artist').fontString(this.posterHeight);
  }

  protected artistLines() {
    const lines: string[] = [];
    const poster = this.poster;
    const afp = this.fontPkg('artist');

    this.setArtistFont();
    let currentLine = '';
    for (let artist of this.poster.artistNames) {
      const lineWidth = this.calculateTextWidth(afp, currentLine, artist);
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
    ctx.fillStyle = this.fontPkg('artist').fontColor;

    const lineHeight = this.fontPkg('artist').lineHeight(this.posterHeight);
    console.log(lineHeight);
    let movingTop: number = 0;
    lines.forEach((line, i) => {
      movingTop = baseTop + (i + 1) * lineHeight;
      this.printCenter(line, movingTop, this.fontPkg('artist'));
    });

    const bottom = movingTop + lineHeight;

    return {
      top: baseTop,
      bottom,
      height: bottom - baseTop,
    };
  }

  public clearTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  public setSkew() {
    if (this.theme.skewText) this.ctx.transform(1, 0.06, 0.06, 1, -20, 0);
  }

  public printCenter(str: string, top: number, fp: FontPkg) {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    fp.draw(str, this.midX, top, this.maxPosterWidth, ctx, this.posterHeight);
    ctx.restore();
  }

  public printLeft(str: string, top: number, fp: FontPkg) {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'left';
    fp.draw(
      str,
      this.sideMargin,
      top,
      this.maxPosterWidth,
      ctx,
      this.posterHeight,
    );
    ctx.restore();
  }

  public printRight(str: string, top: number, fp: FontPkg) {
    this.ctx.save();
    this.ctx.textAlign = 'right';
    fp.draw(
      str,
      this.posterWidth - this.sideMargin,
      top,
      this.maxPosterWidth,
      this.ctx,
      this.posterHeight,
    );
    this.ctx.restore();
  }

  public drawFestivalName() {
    const ctx = this.poster.canvasCtx;
    const { nameFontPackage } = this.theme;
    ctx.save();
    ctx.font = nameFontPackage.fontString(this.posterHeight);
    ctx.fillStyle = nameFontPackage.fontColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    this.printCenter(
      this.poster.festivalName,
      this.festivalNameTop,
      nameFontPackage,
    );
    ctx.restore();
  }
}

export class BasicLayout extends PosterTextLayout {}
export class WeekendLayout extends PosterTextLayout {
  dayFont() {
    this.ctx.font = this.theme.artistFontPackage.fontString(
      this.posterHeight,
      2,
    );
  }

  artistFont() {
    this.ctx.font = this.theme.artistFontPackage.fontString(this.posterHeight);
  }

  drawArtistBlock(artistTopOverride?: number): ArtistBlockMetrics {
    const lines = this.artistLines();
    const oneThird = Math.ceil(lines.length / 3);
    const day1Lines = lines.slice(0, oneThird);
    const day2Lines = lines.slice(oneThird, oneThird * 2);
    const day3Lines = lines.slice(oneThird * 2);
    const { ctx } = this;
    const { artistFontPackage: afp } = this.theme;
    ctx.save();

    ctx.textBaseline = 'bottom';
    ctx.fillStyle = afp.fontColor;

    const lineHeight = afp.lineHeight(this.posterHeight);
    const startTop = artistTopOverride || this.artistTop;
    const actualTop = startTop - lineHeight;
    let movingTop = startTop;

    this.dayFont();
    this.printLeft('FRIDAY', movingTop, afp);
    this.artistFont();

    day1Lines.forEach((line, i) => {
      movingTop += lineHeight;
      this.printLeft(line, movingTop, afp);
    });

    movingTop = movingTop + lineHeight * 3;

    this.dayFont();
    this.printRight('SATURDAY', movingTop, afp);
    this.artistFont();

    day2Lines.forEach((line, i) => {
      movingTop += lineHeight;
      this.printRight(line, movingTop, afp);
    });

    movingTop = movingTop + lineHeight * 3;
    ctx.textAlign = 'left';

    this.dayFont();
    this.printLeft('SUNDAY', movingTop, afp);
    this.artistFont();
    day3Lines.forEach(line => {
      movingTop += lineHeight;
      this.printLeft(line, movingTop, afp);
    });

    ctx.restore();
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
