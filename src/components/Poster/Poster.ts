import { PosterState } from '../../store/Poster/posterSlice';
import { AppError } from '../../error';
import useTypedSelector from '../../store/rootReducer';
import { createHiDPICanvas } from './CanvasUtils';
import { PosterTheme, usePosterTheme } from './PosterTheme';
import { PosterTextLayout } from './PosterTextLayout';
import { usePosterLayout } from './PosterTextLayout';
import FontFaceObserver from 'fontfaceobserver';
import { useMemo } from 'react';

type Case = 'none' | 'upper';
export abstract class Poster {
  public canvas!: HTMLCanvasElement;
  public canvasCtx!: CanvasRenderingContext2D;
  protected _w: number = 0;
  protected _h: number = 0;
  public img!: HTMLImageElement;

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

  protected static getContext(can: HTMLCanvasElement) {
    const ctx = can.getContext('2d');
    if (!ctx) throw new AppError('Expected canvas context');
    return ctx;
  }

  public setPosterSize(w: number, h: number) {
    this._w = w;
    this._h = h;
  }

  public get w() {
    if (this._w !== 0) return this._w;
    if (this.img) return this.img.naturalWidth;
    throw new Error('Cannot determine width for poster');
  }

  public get h() {
    if (this._h !== 0) return this._h;
    if (this.img) return this.img.naturalHeight;
    throw new Error('Cannot determine height for poster');
  }

  public get artistSeperator() {
    // return this.ps.
    return String.fromCharCode(8226);
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

  protected async load(can: HTMLCanvasElement, loadBackground = true) {
    const artistFont = new FontFaceObserver(this.theme.artistFont);
    const nameFont = new FontFaceObserver(this.theme.festivalNameFont);
    const toAwait = [artistFont.load(), nameFont.load()];
    if (loadBackground) toAwait.push(this.drawBackground(can));
    try {
      await Promise.all(toAwait);
    } catch (e) {
      console.error(e);
    }
  }

  public async draw(can: HTMLCanvasElement, drawBackground = true) {
    await this.load(can, drawBackground);

    this.canvasCtx = Poster.getContext(can);
    can.width = this.w;
    can.height = this.h;
    createHiDPICanvas(can, this.w, this.h);

    this.layout.drawFestivalName();
    this.layout.drawArtistBlock();
  }

  public async drawBackground(can: HTMLCanvasElement): Promise<void> {
    const ctx = Poster.getContext(can);
    this.img = new Image();
    const img = this.img;
    return new Promise(resolve => {
      img.onload = () => {
        const scale = Math.max(can.width / img.width, can.height / img.height);
        const x = can.width / 2 - (img.width / 2) * scale;
        const y = can.height / 2 - (img.height / 2) * scale;
        can.width = this.w;
        can.height = this.h;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        resolve();
      };
      img.src = this.theme.backgroundImage;
    });
  }
}

class BasicPoster extends Poster {}

// export const usePosterSize = () => {
//   // const [, windowH] = useWindowSize();
//   // const h = Math.floor(windowH * 0.8);
//   // const w = Math.floor(h * 0.7);
//   const w = 600;
//   const h = 900;
//   return [Math.min(w, MAX_POSTER_WIDTH), Math.min(h, MAX_POSTER_HEIGHT)];
// };

export const usePoster = (): Poster => {
  const theme = usePosterTheme();
  const layout = usePosterLayout();
  const ps = useTypedSelector(s => s.poster);

  const posterMemo = useMemo(() => {
    const poster = new BasicPoster(ps, theme, layout);
    return poster;
  }, [layout, ps, theme]);
  return posterMemo;
};
