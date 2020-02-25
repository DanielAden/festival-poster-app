import { Poster } from './Poster';
import useTypedSelector from '../../store/rootReducer';
import { AppError } from '../../error';
import { useMemo } from 'react';
import {
  TextBoxLine,
  MultilineTextBox,
  TextBox,
  CoachellaDateShape,
} from './TextBox';
import { FontPackage } from './FontPackage';

export abstract class PosterTextLayout {
  public abstract dateCount: number;
  public abstract headlinerLineCount: number;
  protected text!: {
    name: TextBoxLine;
    presentedBy?: TextBoxLine;
  };
  constructor(private _poster?: Poster) {}

  public set poster(poster: Poster) {
    this._poster = poster;
  }

  public get poster() {
    if (!this._poster)
      throw new Error('Expected poster to be set before drawing');
    return this._poster;
  }

  public initText() {
    const { poster } = this;
    let presentedBy;
    if (poster.drawPresentedBy) {
      presentedBy = new TextBoxLine(
        poster.presentedByText,
        poster,
        this.fontPkg('name'),
      );
    }
    this.text = {
      name: new TextBoxLine(poster.festivalName, poster, this.fontPkg('name')),
      presentedBy,
    };
  }

  protected get ctx() {
    return this.poster.canvasCtx;
  }

  protected get theme() {
    return this.poster.theme;
  }

  protected fontPkg(type: 'artist' | 'name' | 'date') {
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
    return this.poster.midX;
  }

  protected get midY() {
    return this.poster.midY;
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

  protected get headlinersLine1() {
    const list = this.poster.getHeadlinersList(0);
    if (list.length === 0) return '';
    return list[0];
  }

  protected get headlinersLine2() {
    const list = this.poster.getHeadlinersList(1);
    if (list.length === 0) return '';
    return list[0];
  }

  protected get headlinersLine3() {
    const list = this.poster.getHeadlinersList(2);
    if (list.length === 0) return '';
    return list[0];
  }

  public get artistTop() {
    return this.posterHeight * this.theme.artistTopRatio;
  }

  public get artistNames() {
    return this.poster.artistNames;
  }

  protected calculateTextWidth(fp: FontPackage, ...text: string[]) {
    const fullText = text.reduce((prev, cur) => prev + cur, '');
    const metrics = this.ctx.measureText(fullText);
    return Math.ceil(metrics.width);
  }

  protected setArtistFont() {
    // this.ctx.font = this.fontPkg('artist').fontString(this.posterHeight);
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

  public drawArtistBlock() {
    const { poster } = this;
    const fontPkg = this.fontPkg('artist');
    TextBox.seperator = poster.artistSeperator;
    const artistBlock = new MultilineTextBox(this.artistNames, poster, fontPkg);
    artistBlock.setXY(0, this.artistTop);
    artistBlock.draw();
  }

  public clearTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  public drawFestivalName() {
    const { name: tbName, presentedBy } = this.text;
    tbName.textAlign = 'center';
    tbName.x = this.midX;
    tbName.y = this.festivalNameTop;
    tbName.draw();

    if (presentedBy) {
      tbName.drawAbove(presentedBy.scale(0.2));
    }
  }

  protected initDates() {
    return this.poster.dates.map(date => {
      return new TextBoxLine(date.date, this.poster, this.fontPkg('date'));
    });
  }

  public drawDates() {
    if (!this.poster.drawDates) return;
    const [date1box] = this.initDates();
    const y =
      // this.theme.nameFontPkg.lineHeight(this.posterHeight) +
      this.festivalNameTop + date1box.height;
    date1box.setXY(this.midX, y);
    // date1box.draw();
  }

  public drawPresentedBy(x: number, y: number) {
    const pbTextBox = new TextBoxLine(
      this.poster.presentedByText,
      this.poster,
      this.theme.nameFontPkg,
    );

    pbTextBox._scale = 0.2;
    pbTextBox.setXY(x, y);
    pbTextBox.draw();
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
  private HEADLINER_TEXT_SCALE = 2;
  private DATE_TEXT_SCALE = 0.8;

  scaleDownArtistFont() {
    const { artistFontPkg: afp } = this.theme;
    this.currentArtistFontSize =
      this.currentArtistFontSize * this.textScaleDelta;
    this.ctx.font = `${this.currentArtistFontSize}px ${afp.fontType}`;
  }

  drawArtistBlock() {
    const { artistNames, poster, HEADLINER_TEXT_SCALE, DATE_TEXT_SCALE } = this;
    const oneThird = Math.ceil(artistNames.length / 3);
    const fontPkg = this.fontPkg('artist');
    TextBox.seperator = poster.artistSeperator;

    const _draw = (
      headlinerName: string = 'ADD A HEADLINER',
      i: number,
      top: number,
    ) => {
      const date = poster.dates[i].date;
      const align = i === 1 ? 'right' : 'left';
      const dateAlign = i === 1 ? 'left' : 'right';
      const headliner = new TextBoxLine([headlinerName], poster, fontPkg);
      headliner
        .setXY(0, top)
        .scale(HEADLINER_TEXT_SCALE)
        .align(align);
      headliner.draw();

      const headlinerMid = headliner.height / 2;
      const dateLine = new TextBoxLine([date], poster, fontPkg);
      dateLine
        .setXY(0, top + headlinerMid - dateLine.height / 2)
        .scale(DATE_TEXT_SCALE)
        .align(dateAlign)
        .overrideStroke(false);
      // this.drawDateShape();
      new CoachellaDateShape(dateLine).draw();
      dateLine.draw();

      const artistTb = new MultilineTextBox(
        artistNames.slice(oneThird * i, oneThird * (i + 1)),
        poster,
        fontPkg,
      ).align(align);
      headliner.drawBelow(artistTb, false);
      return headliner.bottom + artistTb.height;
    };

    let top = this.artistTop;
    top = _draw(poster.getHeadlinersList(0)[0], 0, top);
    top = _draw(poster.getHeadlinersList(1)[0], 1, top);
    _draw(poster.getHeadlinersList(2)[0], 2, top);
  }
}

export class WeekendLayout extends PosterTextLayout {
  dateCount = 3;
  headlinerLineCount = 0;
  private DAY_TEXT_SCALE = 2;

  drawArtistBlock() {
    const { artistNames, poster } = this;
    const oneThird = Math.ceil(artistNames.length / 3);
    const fontPkg = this.fontPkg('artist');

    TextBox.seperator = poster.artistSeperator;
    const tbs: TextBox[] = [];
    const days = ['FRIDAY', 'SATURDAY', 'SUNDAY'];
    [0, 1, 2].forEach(i => {
      const align = i === 1 ? 'right' : 'left';
      tbs.push(
        new TextBoxLine(days[i], poster, fontPkg)
          .scale(this.DAY_TEXT_SCALE)
          .setXY(0, this.artistTop)
          .align(align),
      );
      const artistTb = new MultilineTextBox(
        artistNames.slice(oneThird * i, oneThird * (i + 1)),
        poster,
        fontPkg,
      ).align(align);
      tbs.push(artistTb);
    });

    let lastTb = tbs[0];
    lastTb.draw();
    tbs.slice(1).forEach(tb => {
      lastTb.drawBelow(tb, false);
      lastTb = tb;
    });
  }

  public drawDates() {} // Dates are drawn in the artist block for this layout
}

export class TestLayout extends PosterTextLayout {
  dateCount = 0;
  headlinerLineCount = 0;

  drawArtistBlock() {
    return {
      top: 0,
      bottom: 0,
      height: 0,
    };
  }

  drawDates() {}
  drawPresentedBy() {}

  drawFestivalName() {
    // this.testDrawBasic();
    // this.testDrawBelow();
    // this.testDrawBorderBox();
    // this.testDrawAbove();
    this.testDrawMultiLine();
  }

  testDrawBasic() {
    const { poster } = this;
    const tb = new TextBoxLine(
      'TextBox Test Line',
      poster,
      this.fontPkg('name'),
    );
    tb.draw();
  }

  testDrawBorderBox() {
    const { poster } = this;
    const tb = new TextBoxLine('Gg', poster, this.fontPkg('name'));
    tb.setXY(50, 100);
    tb.draw().box();

    // this.drawHorizontalLine(tb.x, tb.right, tb.y);
    // this.drawHorizontalLine(tb.x, tb.right, tb.bottom);

    // ctx.beginPath(); // Start a new path
    // ctx.moveTo(tb.x, tb.bottom);
    // ctx.lineTo(tb.right, tb.bottom);
    // ctx.stroke();
  }

  testDrawBelow() {
    const { poster } = this;
    const tb = new TextBoxLine('iIjJgGTest1', poster, this.fontPkg('name'));
    const tb2 = new TextBoxLine('iIjJgGITest2', poster, this.fontPkg('name'));

    tb.setXY(50, 100);
    tb.draw().box();
    tb.drawBelow(tb2);
  }

  testDrawAbove() {
    const { poster } = this;
    const tb = new TextBoxLine('iIjJgGTest1', poster, this.fontPkg('name'));
    const tb2 = new TextBoxLine('iIjJgGITest2', poster, this.fontPkg('name'));

    tb.setXY(this.midX, 100);
    tb.drawAbove(tb2).box();
    tb.draw().box();
  }

  testDrawMultiLine() {
    const { poster } = this;
    const mltb = new MultilineTextBox(
      poster.artistNames,
      poster,
      this.fontPkg('artist'),
    );
    mltb.setXY(0, 800);
    mltb.draw();
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
      case 'coachella':
        return new CoachellaLayout();
      case 'test':
        return new TestLayout();
      default:
        throw new AppError(`Invalid theme ${layoutType}`);
    }
  }, [layoutType]);
  return layoutMeme;
};
