import { PosterState } from '../../store/Poster/posterSlice';
import { AppError } from '../../error';
import useTypedSelector from '../../store/rootReducer';
import { createHiDPICanvas } from './CanvasUtils';
import { PosterTheme, usePosterTheme } from './PosterTheme';
import { PosterTextLayout } from './PosterTextLayout';
import { usePosterLayout } from './PosterTextLayout';
import FontFaceObserver from 'fontfaceobserver';
import { useMemo } from 'react';
import { useMe } from '../../spotify/SpotifyAPIHooks';

const DEFAULT_FESTIVAL_NAME = 'My Festival';
const festivalNameTemplate = (one: string) => `${one} FEST`;

type Case = 'none' | 'upper';
export abstract class Poster {
  public canvas!: HTMLCanvasElement;
  public canvasCtx!: CanvasRenderingContext2D;
  protected _w: number = 0;
  protected _h: number = 0;
  public img!: HTMLImageElement;
  protected _drawBackground: boolean = true;

  protected festivalNameText: string = DEFAULT_FESTIVAL_NAME;
  protected festivalNameCase: Case = 'upper';

  protected artistCase: Case = 'upper';

  constructor(
    protected ps: PosterState,
    public theme: PosterTheme,
    protected layout: PosterTextLayout,
  ) {}

  protected get artistFontPkg() {
    return this.theme.artistFontPackage;
  }

  protected get festivalNameFontPkg() {
    return this.theme.nameFontPackage;
  }

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

  public get festivalName(): string {
    return this.festivalNameCase === 'upper'
      ? this.festivalNameText.toUpperCase()
      : this.festivalNameText;
  }

  public set display_name(displayName: string | undefined) {
    if (!displayName) {
      this.festivalNameText = DEFAULT_FESTIVAL_NAME;
      return;
    }
    this.festivalNameText = festivalNameTemplate(displayName);
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
    const artistFont = new FontFaceObserver(this.artistFontPkg.fontType);
    const nameFont = new FontFaceObserver(this.festivalNameFontPkg.fontType);

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
    createHiDPICanvas(can, this.w, this.h);
    await this.load(can, drawBackground);

    this._drawBackground = drawBackground;
    this.canvas = can;
    this.canvasCtx = Poster.getContext(this.canvas);
    this.layout.poster = this;
    await this._draw();
  }

  protected async _draw({
    drawBackground = true,
    drawArtistBlock = true,
    drawFestivalName = true,
  } = {}) {
    this.clear();
    if (drawBackground && this._drawBackground)
      await this.drawBackground(this.canvas);
    if (drawFestivalName) this.layout.drawFestivalName();
    if (drawArtistBlock) await this.drawArtistBlock();
  }

  protected async drawArtistBlock() {
    const { bottom } = this.layout.drawArtistBlock();
    const { maxPosterHeight } = this.layout;
    if (bottom <= maxPosterHeight) return;
    const newTop = this.layout.artistTop - (bottom - maxPosterHeight);
    await this._draw({ drawArtistBlock: false });
    this.layout.drawArtistBlock(newTop);
  }

  public clear() {
    this.canvasCtx.clearRect(0, 0, this.w, this.h);
  }

  public async drawMultiCanvas(
    can: HTMLCanvasElement,
    backgroundCanvas?: HTMLCanvasElement,
  ) {
    createHiDPICanvas(can, this.w, this.h);
    if (backgroundCanvas) await this.drawBackground(backgroundCanvas);
    await this.draw(can, false);
    return;
  }

  public async loadImage(imgWidth?: number, imgHeight?: number): Promise<void> {
    this.img = new Image(imgWidth, imgHeight);
    return new Promise(resolve => {
      this.img.onload = () => {
        resolve();
      };
      this.img.src = this.theme.backgroundImage;
    });
  }

  public async drawBackground(can: HTMLCanvasElement): Promise<void> {
    createHiDPICanvas(can, this.w, this.h);
    await this.loadImage();
    const imgWidth = this.img.naturalWidth;
    const imgHeight = this.img.naturalHeight;
    const ctx = Poster.getContext(can);
    ctx.drawImage(this.img, 0, 0, imgWidth, imgHeight, 0, 0, this.w, this.h);
  }
}

class BasicPoster extends Poster {}

export const usePoster = (): Poster => {
  const me = useMe();
  const theme = usePosterTheme();
  const layout = usePosterLayout();
  const ps = useTypedSelector(s => s.poster);

  const posterMemo = useMemo(() => {
    const poster = new BasicPoster(ps, theme, layout);
    poster.display_name = me?.display_name;
    return poster;
  }, [layout, me, ps, theme]);
  return posterMemo;
};
