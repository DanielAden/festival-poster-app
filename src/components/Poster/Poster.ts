import { PosterState } from '../../store/Poster/posterSlice';
import { AppError } from '../../error';
import useTypedSelector from '../../store/rootReducer';
import { useLayoutEffect, useState } from 'react';
import { createHiDPICanvas } from './CanvasUtils';
import { DEFAULT_BACKGROUND_IMAGE, fireworks, city } from '../../images';

abstract class PosterTheme {
  public backgroundImage: string = DEFAULT_BACKGROUND_IMAGE;
  public festivalNameColor: string = 'white';
  public festivalNameFont: string = 'serif';

  public artistFont: string = 'serif';
  public artistColor: string = 'white';
}

class Theme1 extends PosterTheme {
  backgroundImage = fireworks;
  festivalNameColor = 'lightblue';
  festivalNameFont = 'serif';

  artistFont = 'serif';
  artistColor = 'tomato';
}

class Theme2 extends PosterTheme {
  backgroundImage = city;
  festivalNameColor = 'lime';
  festivalNameFont = 'serif';

  artistFont = 'serif';
  artistColor = 'lime';
}

abstract class PosterTextLayoutBase {
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
    this.poster.canvasCtx.font = this.fontString(
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

class BasicLayout extends PosterTextLayoutBase {}
class WeekendLayout extends PosterTextLayoutBase {}

type Case = 'none' | 'upper';
abstract class Poster {
  public canvasCtx!: CanvasRenderingContext2D;
  protected _w: number = 900;
  protected _h: number = 600;
  protected _postDrawCB?: any;

  protected _bgImage: string = DEFAULT_BACKGROUND_IMAGE;

  protected festivalNameText: string = 'My Festival';
  protected festivalNameCase: Case = 'upper';

  public artistSeperator: string = '/';
  protected artistCase: Case = 'upper';

  constructor(
    protected ps: PosterState,
    public theme: PosterTheme,
    protected layout: PosterTextLayoutBase,
  ) {
    this.layout.poster = this;
  }

  protected getContext(can: HTMLCanvasElement) {
    const ctx = can.getContext('2d');
    if (!ctx) throw new AppError('Expected canvas context');
    return ctx;
  }

  public setPosterSize(w: number, h: number) {
    this._w = w;
    this._h = h;
  }

  public get h() {
    return this._h;
  }

  public get w() {
    return this._w;
  }

  public set backgroundImage(image: string) {
    this._bgImage = image;
  }

  // From this tutorial: https://riptutorial.com/html5-canvas/example/19169/scaling-image-to-fit-or-fill-
  protected _drawBGImage(can: HTMLCanvasElement, img: HTMLImageElement) {
    let ctx = this.getContext(can);
    const scale = Math.max(can.width / img.width, can.height / img.height);
    const x = can.width / 2 - (img.width / 2) * scale;
    const y = can.height / 2 - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  public get festivalName() {
    return this.festivalNameCase === 'upper'
      ? this.festivalNameText.toUpperCase()
      : this.festivalNameText;
  }

  public get artistNames() {
    let artists = this.ps.artists.filter(a => a.isSelected);
    const artistNames = artists.map(a => {
      let { name } = a.data;
      if (this.artistCase === 'upper') name = name.toUpperCase();
      return name;
    });
    return artistNames;
  }

  protected _draw() {
    this.layout.drawFestivalName();
    this.layout.drawArtistBlock();
  }

  public set postDrawCB(cb: any) {
    this._postDrawCB = cb;
  }

  public draw(can: HTMLCanvasElement, drawBackground = false) {
    this.canvasCtx = this.getContext(can);
    can.width = this.w;
    can.height = this.h;
    createHiDPICanvas(can, this.w, this.h);

    const cb = () => {
      this._draw();
      if (this._postDrawCB) this._postDrawCB();
    };

    if (!drawBackground) {
      this._draw();
    } else {
      this.drawBackground(can, cb.bind(this));
    }
  }

  public drawBackground(can: HTMLCanvasElement, cb?: any) {
    const img = new Image(this.w, this.h); // TODO try removing w and h paremeters
    img.onload = () => {
      this._drawBGImage(can, img);
      if (cb) cb();
    };
    img.src = this.theme.backgroundImage;
  }
}

class BasicPoster extends Poster {}

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export const usePosterSize = () => {
  const [, windowH] = useWindowSize();
  const h = Math.floor(windowH * 0.8);
  const w = Math.floor(h * 0.7);
  return [w, h];
};

export const usePosterTheme = (): PosterTheme => {
  const themeType = useTypedSelector(s => s.poster.themeType);
  let theme;
  switch (themeType) {
    case 'theme1':
      theme = new Theme1();
      break;
    case 'theme2':
      theme = new Theme2();
      break;
    default:
      throw new AppError(`Invalid theme ${themeType}`);
  }
  return theme;
};

export const usePosterLayout = (): PosterTextLayoutBase => {
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

export const usePoster = (): Poster => {
  const [w, h] = usePosterSize();
  const theme = usePosterTheme();
  const layout = usePosterLayout();
  const ps = useTypedSelector(s => s.poster);
  const poster = new BasicPoster(ps, theme, layout);

  poster.setPosterSize(w, h);
  return poster;
};
