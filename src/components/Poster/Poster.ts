import { PosterState } from '../../store/Poster/posterSlice';
import { AppError } from '../../error';
import useTypedSelector from '../../store/rootReducer';
import { useLayoutEffect, useState } from 'react';
import { createHiDPICanvas } from './CanvasUtils';
import { PosterTheme, usePosterTheme } from './PosterTheme';
import { PosterTextLayout } from './PosterTextLayout';
import { usePosterLayout } from './PosterTextLayout';

const MAX_POSTER_WIDTH = 600;
const MAX_POSTER_HEIGHT = 900;

type Case = 'none' | 'upper';
export abstract class Poster {
  public canvasCtx!: CanvasRenderingContext2D;
  protected _w: number = 900;
  protected _h: number = 600;
  protected _postDrawCB?: any;

  protected festivalNameText: string = 'My Festival';
  protected festivalNameCase: Case = 'upper';

  protected artistCase: Case = 'upper';

  constructor(
    protected ps: PosterState,
    public theme: PosterTheme,
    protected layout: PosterTextLayout,
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

  public get artistSeperator() {
    // return this.ps.
    return String.fromCharCode(8226);
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
    const img = new Image(this.w, this.h);
    can.width = this.w;
    can.height = this.h;
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
  // const [, windowH] = useWindowSize();
  // const h = Math.floor(windowH * 0.8);
  // const w = Math.floor(h * 0.7);
  const w = 600;
  const h = 900;
  return [Math.min(w, MAX_POSTER_WIDTH), Math.min(h, MAX_POSTER_HEIGHT)];
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
