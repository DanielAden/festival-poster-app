import React, { useRef, useState, useEffect } from 'react'
import '../../style/Poster.css'
import { getPosterTheme } from './PosterThemes'
import {createHiDPICanvas} from './CanvasUtils'
import useTypedSelector from '../../store/rootReducer'



interface Props {
  themeType?: string; 
}
const Poster: React.FC<Props> = ({ themeType = 'theme1' }) => {
  let artists = useTypedSelector((s) => s.poster.artists)
  artists = artists.filter(a => a.isSelected)

  const [width,] = useState(600);
  const [height,] = useState(900);
  const ref = useRef<HTMLCanvasElement>(null);
  const festivalName = 'My Festival';

  useEffect(() => {
    const can = ref.current;
    if (!can) throw new Error('Unable to retreive poster canvas element')
    const ctx = ref.current?.getContext('2d');
    if (!ctx) throw new Error('Expected context interface')
    createHiDPICanvas(can, width, height);

    const theme = getPosterTheme(themeType);

    const draw = (ctx: CanvasRenderingContext2D) => {
      const img = new Image(width, height);
      img.onload = () => {
        // ctx.drawImage(img, 0, 0);
        // drawImageProp(ctx, img, 0, 0, width, height);
        scaleToFill(img);
        drawFestivalName(ctx);
        drawArtistBlock(ctx);
      }
      img.src = theme.image; 
    }

    const drawFestivalName = (ctx: CanvasRenderingContext2D) => {
      const midX = width / 2;
      ctx.font = theme.festivalNameFont;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.fillStyle = theme.fontColor;

      ctx.shadowColor = 'black';
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 2;

      ctx.fillText(festivalName, midX, 30);
    }

    const drawArtistBlock = (ctx: CanvasRenderingContext2D) => {
      const baseTop = 300;
      const names = artists.map(a => a.text);

      ctx.font = theme.artistFont;
      const lines = breakLines(ctx, names, width, theme.seperator);

      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.fillStyle = theme.fontColor;

      lines.forEach((line, i) => {
        const top = baseTop + ((i + 1) * theme.artistTextHeight);
        ctx.fillText(line, width / 2, top, width);
      })
    }

    // From this tutorial: https://riptutorial.com/html5-canvas/example/19169/scaling-image-to-fit-or-fill-
    const scaleToFill = (img: HTMLImageElement) => {
      // get the scale
      var scale = Math.max(width / img.width, height / img.height);
      var x = (width / 2) - (img.width / 2) * scale;
      var y = (height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    draw(ctx);
  }, [artists, height, ref, themeType, width])

  const style = (): React.CSSProperties => {
    return {
      border: '3px solid',
    }
  }

  return (
    <canvas ref={ref} id="poster" style={style()}>
      Festival Poster Viewer
    </canvas>
  )
}

const breakLines = (ctx: CanvasRenderingContext2D, artists: string[], width: number, seperator: string): string[] => {
  const lines: string[] = [];
  let currentLine = '';
  const cutTrailingChar = (s: string) => s.slice(0, s.length - 1);
  for (let artist of artists) {
    const lineWidth = Math.ceil(ctx.measureText(currentLine + artist).width);
    if (lineWidth > width) {
      lines.push(cutTrailingChar(currentLine))
      currentLine = artist + seperator;
      continue;
    }
    currentLine = currentLine + artist + seperator;
  }
  if (currentLine !== '') lines.push(cutTrailingChar(currentLine))
  return lines;
} 


export default Poster;
  