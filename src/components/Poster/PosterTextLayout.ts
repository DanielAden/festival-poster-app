import { Poster } from './Poster';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';
import FontPkg from './PosterFontPackage';
import { TextBox } from './TextBox';

interface ArtistBlockMetrics {
  top: number;
  bottom: number;
  height: number;
}

export abstract class PosterTextLayout {
  public abstract dateCount: number;
  public abstract headlinerLineCount: number;
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

  public fontPkg(type: 'artist' | 'name' | 'date') {
    switch (type) {
      case 'artist':
        return this.theme.artistFontPkg;
      case 'name':
        return this.theme.nameFontPkg;
      case 'date':
        return this.theme.dateFontPkg;
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

  protected get headliners() {
    return this.poster.headliners;
  }

  protected get headlinersLine1() {
    if (this.headliners.line1.length === 0) return '';
    return this.headliners.line1[0];
  }

  protected get headlinersLine2() {
    if (this.headliners.line2.length === 0) return '';
    return this.headliners.line2[0];
  }

  protected get headlinersLine3() {
    if (this.headliners.line3.length === 0) return '';
    return this.headliners.line3[0];
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

    const lineHeight = this.fontPkg('artist').lineHeight(this.posterHeight);
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
      this.poster.maxLeft,
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
      this.poster.maxRight,
      top,
      this.maxPosterWidth,
      this.ctx,
      this.posterHeight,
    );
    this.ctx.restore();
  }

  public drawFestivalName() {
    const ctx = this.poster.canvasCtx;
    const { nameFontPkg: nameFontPackage } = this.theme;
    ctx.save();

    if (this.poster.drawPresentedBy) {
      ctx.textBaseline = 'bottom';
      this.drawPresentedBy(0, this.festivalNameTop);
    }

    ctx.font = nameFontPackage.fontString(this.posterHeight);
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

  protected initDates() {
    return this.poster.dates.map(date => {
      return new TextBox(
        this.ctx,
        this.poster,
        date.date,
        this.fontPkg('date'),
      );
    });
  }

  public drawDates() {
    if (!this.poster.drawDates) return;
    const [date1box] = this.initDates();
    const y =
      this.theme.nameFontPkg.fontHeight(this.posterHeight) +
      this.festivalNameTop +
      date1box.metrics.height;
    date1box.draw(this.midX, y, 'center');
  }

  public drawPresentedBy(x: number, y: number) {
    const pbTextBox = new TextBox(
      this.ctx,
      this.poster,
      this.poster.presentedByText,
      this.theme.nameFontPkg,
    );

    pbTextBox.scale = 0.2;
    pbTextBox.draw(x, y);
  }
}

export class BasicLayout extends PosterTextLayout {
  dateCount = 1;
  headlinerLineCount = 0;
}

export class CoachellaLayout extends PosterTextLayout {
  dateCount = 1;
  headlinerLineCount = 1;
  private textScaleDelta: number = 0.9;
  private currentArtistFontSize = 0;

  setArtistFont() {
    const { artistFontPkg: afp } = this.theme;
    this.currentArtistFontSize = afp.fontHeight(this.posterHeight);
    this.ctx.font = this.theme.artistFontPkg.fontString(this.posterHeight);
  }

  scaleDownArtistFont() {
    const { artistFontPkg: afp } = this.theme;
    this.currentArtistFontSize =
      this.currentArtistFontSize * this.textScaleDelta;
    this.ctx.font = `${this.currentArtistFontSize}px ${afp.fontType}`;
  }

  setHeadlinerFont() {
    this.ctx.font = this.theme.artistFontPkg.fontString(this.posterHeight, 2);
  }

  private get artistNames() {
    return this.poster.artistNames;
  }

  protected artistLines() {
    const lines: string[] = [];
    const poster = this.poster;
    const afp = this.fontPkg('artist');

    this.setArtistFont();
    let currentLine = '';
    for (let artist of this.artistNames) {
      const lineWidth = this.calculateTextWidth(afp, currentLine, artist);
      if (lineWidth > this.maxPosterWidth) {
        lines.push(this.cutTrailingChar(currentLine));
        currentLine = artist + poster.artistSeperator;
        this.scaleDownArtistFont();
        continue;
      }
      currentLine = currentLine + artist + poster.artistSeperator;
    }
    if (currentLine !== '') lines.push(this.cutTrailingChar(currentLine));
    return lines;
  }

  drawArtistBlock(artistTopOverride?: number): ArtistBlockMetrics {
    const { ctx } = this;
    ctx.save();
    ctx.textBaseline = 'bottom';

    const { artistFontPkg: afp } = this.theme;
    const lineHeight = afp.lineHeight(this.posterHeight);
    const startTop = artistTopOverride || this.artistTop;
    const artistLines = this.artistLines();
    let movingTop = startTop;

    const hlLine1 = this.headlinersLine1;
    this.setHeadlinerFont();
    this.printLeft(hlLine1, movingTop, afp);
    this.setArtistFont();
    this.printRight('FRIDAY', movingTop, this.theme.artistFontPkg);

    artistLines.forEach((l, i) => {
      movingTop = movingTop + lineHeight;
      this.printLeft(l, movingTop, afp);
      this.scaleDownArtistFont();
    });

    ctx.restore();
    return { bottom: 0, top: startTop, height: 0 };
  }
}

export class WeekendLayout extends PosterTextLayout {
  dateCount = 3;
  headlinerLineCount = 0;

  artistFont() {
    this.ctx.font = this.theme.artistFontPkg.fontString(this.posterHeight);
  }

  drawArtistBlock(artistTopOverride?: number): ArtistBlockMetrics {
    const dateBoxes = this.initDates();
    const lines = this.artistLines();
    const oneThird = Math.ceil(lines.length / 3);
    const day1Lines = lines.slice(0, oneThird);
    const day2Lines = lines.slice(oneThird, oneThird * 2);
    const day3Lines = lines.slice(oneThird * 2);
    const { ctx } = this;
    const { artistFontPkg: afp } = this.theme;
    ctx.save();
    this.artistFont();
    ctx.textBaseline = 'top';

    const lineHeight = afp.lineHeight(this.posterHeight);
    const startTop = artistTopOverride || this.artistTop;
    let movingTop = startTop;

    dateBoxes.forEach(db => (db.scale = 2));
    const dateLH = dateBoxes[0].lineHeight;

    const drawDate = (i: number, right = false) => {
      if (this.poster.showDates) {
        right
          ? dateBoxes[i].drawRight(movingTop)
          : dateBoxes[i].drawLeft(movingTop);
        movingTop += dateLH;
      } else {
        movingTop += dateLH;
      }
    };

    drawDate(0);

    day1Lines.forEach((line, i) => {
      this.printLeft(line, movingTop, afp);
      movingTop += lineHeight;
    });

    drawDate(1, true);

    day2Lines.forEach((line, i) => {
      this.printRight(line, movingTop, afp);
      movingTop += lineHeight;
    });

    drawDate(2);

    day3Lines.forEach(line => {
      this.printLeft(line, movingTop, afp);
      movingTop += lineHeight;
    });

    ctx.restore();
    return {
      top: startTop,
      bottom: movingTop + lineHeight,
      height: movingTop + lineHeight - startTop,
    };
  }

  public drawDates() {} // Dates are drawn in the artist block for this layout
}

export const usePosterLayout = (): PosterTextLayout => {
  const layoutType = useTypedSelector(s => s.poster.layoutType);
  const layoutMeme = useMemo(() => {
    switch (layoutType) {
      case 'basic':
        return new BasicLayout();
      case 'weekend':
        return new WeekendLayout();
      case 'coachella':
        return new CoachellaLayout();
      default:
        throw new AppError(`Invalid theme ${layoutType}`);
    }
  }, [layoutType]);
  return layoutMeme;
};
