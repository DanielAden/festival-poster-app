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
  ) {}

  protected static getContext(can: HTMLCanvasElement) {
    const ctx = can.getContext('2d');
    if (!ctx) throw new AppError('Expected canvas context');
    return ctx;
  }

  public setPosterSize(w: number, h: number) {
    this._w = Math.floor(w);
    this._h = Math.floor(h);
  }

  public get w() {
    return this._w;
  }

  public get h() {
    return this._h;
  }

  public get artistSeperator() {
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

  protected async load(can: HTMLCanvasElement, loadBackground: boolean) {
    const artistFont = new FontFaceObserver(this.theme.artistFont);
    const nameFont = new FontFaceObserver(this.theme.festivalNameFont);

    const toAwait = [artistFont.load(), nameFont.load()];
    if (loadBackground) toAwait.push(this.loadImage());
    await this.loadImage();

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

    this.layout.poster = this;
    if (drawBackground) await this.drawBackground(can);
    this.layout.drawFestivalName();
    this.layout.drawArtistBlock();
  }

  public async loadImage(): Promise<void> {
    this.img = new Image(this.w, this.h);
    return new Promise(resolve => {
      this.img.onload = () => {
        resolve();
      };
      this.img.src = this.theme.backgroundImage;
    });
  }

  public async drawBackground(can: HTMLCanvasElement): Promise<void> {
    await this.loadImage();
    const scale = Math.max(this.w / this.img.width, this.h / this.img.height);
    const x = this.w / 2 - (this.img.width / 2) * scale;
    const y = this.h / 2 - (this.img.height / 2) * scale;
    can.width = this.w;
    can.height = this.h;
    const ctx = Poster.getContext(can);
    ctx.drawImage(
      this.img,
      x,
      y,
      this.img.width * scale,
      this.img.height * scale,
    );
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
