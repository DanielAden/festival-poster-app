import city from '../../images/city.jpg';
import fireworks from '../../images/fireworks.jpg';
import { PosterState } from '../../store/Poster/posterSlice';
import { AppError } from '../../error';
import useTypedSelector from '../../store/rootReducer';
import { useLayoutEffect, useState } from 'react';
import { createHiDPICanvas } from './CanvasUtils';

type Case = 'none' | 'upper';
abstract class PosterTheme {
  protected ctx!: CanvasRenderingContext2D;
  protected w: number = 900;
  protected h: number = 600;

  protected bgImage: string = '';

  protected festivalNameText: string = 'My Festival';
  protected festivalNameColor: string = 'white';
  protected festivalNameFont: string = 'serif';
  protected festivalNameFontRatio: number = 0.1;
  protected festivalNameCase: Case = 'upper';

  protected artistSeperator: string = '/';
  protected artistFont = 'serif';
  protected artistColor: string = 'white';
  protected artistFontRatio: number = 0.025;
  protected artistTopRatio: number = 0.5;
  protected artistCase: Case = 'upper';

  constructor(protected ps: PosterState) {}
  protected getContext(can: HTMLCanvasElement) {
    const ctx = can.getContext('2d');
    if (!ctx) throw new AppError('Expected canvas context');
    return ctx;
  }

  public setPosterSize(w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  // From this tutorial: https://riptutorial.com/html5-canvas/example/19169/scaling-image-to-fit-or-fill-
  protected drawBGImage(img: HTMLImageElement) {
    var scale = Math.max(this.w / img.width, this.h / img.height);
    var x = this.w / 2 - (img.width / 2) * scale;
    var y = this.h / 2 - (img.height / 2) * scale;
    this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  protected font(fontRatio: number, font: string) {
    return `${this.fontHeight(fontRatio)}px ${font}`;
  }

  protected fontHeight(size: number) {
    return Math.floor(size * this.h);
  }

  protected cutTrailingChar(s: string) {
    return s.slice(0, s.length - 1);
  }

  protected get midX() {
    return Math.floor(this.w / 2);
  }

  protected get midY() {
    return Math.floor(this.h / 2);
  }

  protected get festivalName() {
    return this.festivalNameCase === 'upper'
      ? this.festivalNameText.toUpperCase()
      : this.festivalNameText;
  }

  protected get artists() {
    return this.ps.artists.filter(a => a.isSelected);
  }

  protected artistLines() {
    const lines: string[] = [];
    let currentLine = '';
    for (let item of this.artists) {
      let artist = item.data;
      if (this.artistCase === 'upper') artist = artist.toUpperCase();
      const lineWidth = Math.ceil(
        this.ctx.measureText(currentLine + artist).width,
      );
      if (lineWidth > this.w) {
        lines.push(this.cutTrailingChar(currentLine));
        currentLine = artist + this.artistSeperator;
        continue;
      }
      currentLine = currentLine + artist + this.artistSeperator;
    }
    if (currentLine !== '') lines.push(this.cutTrailingChar(currentLine));
    return lines;
  }

  protected drawFestivalName() {
    const midX = this.w / 2;
    this.ctx.font = this.font(
      this.festivalNameFontRatio,
      this.festivalNameFont,
    );
    this.ctx.fillStyle = this.festivalNameColor;
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'center';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;

    this.ctx.fillText(this.festivalName, midX, 30);
    this.ctx.strokeText(this.festivalName, midX, 30);
  }

  protected drawArtistBlock() {
    const baseTop = this.h * this.artistTopRatio;
    this.ctx.font = this.font(this.artistFontRatio, this.artistFont);
    const lines = this.artistLines();

    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.artistColor;

    const fh = this.fontHeight(this.artistFontRatio);
    lines.forEach((line, i) => {
      const top = baseTop + (i + 1) * fh;
      this.ctx.fillText(line, this.midX, top, this.w);
    });
  }

  public draw(can: HTMLCanvasElement) {
    this.ctx = this.getContext(can);
    can.width = this.w;
    can.height = this.h;
    createHiDPICanvas(can, this.w, this.h);

    const img = new Image(this.w, this.h);
    img.onload = () => {
      this.drawBGImage(img);
      this.drawFestivalName();
      this.drawArtistBlock();
    };
    img.src = this.bgImage;
  }
}

class PosterTheme1 extends PosterTheme {
  bgImage = fireworks;

  festivalNameFont = 'Impact';
  festivalNameColor = 'tomato';

  artistColor = 'lightblue';
  artistSeperator = String.fromCharCode(8226);
  artistTopRatio = 0.4;
}

class PosterTheme2 extends PosterTheme {
  bgImage = city;

  festivalNameColor = 'lime';
  festivalNameFont = 'Avant Garde';

  artistColor = 'lime';
  artistFontRatio = 0.02;
  artistTopRatio = 0.7;
}

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
  const [w, h] = usePosterSize();
  const ps = useTypedSelector(s => s.poster);
  let theme;
  switch (ps.themeType) {
    case 'theme1':
      theme = new PosterTheme1(ps);
      break;
    case 'theme2':
      theme = new PosterTheme2(ps);
      break;
    default:
      throw new AppError(`Invalid theme ${ps.themeType}`);
  }
  theme.setPosterSize(w, h);
  return theme;
};
