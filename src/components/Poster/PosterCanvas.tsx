import React, { useRef, useEffect } from 'react';
import '../../style/Poster.css';
import { usePoster } from './Poster';

export const POSTER_CANVAS_ID = 'poster-canvas';

const aspectRatio = [2, 3]; // 2:3
const getH = (w: number) => w * (aspectRatio[1] / aspectRatio[0]);
const calculatePosterDims = (width: number, height: number) => {
  let w = width;
  const maxDims = { w: 600, h: 900 };
  if (w > 600) w = maxDims.w;
  let h = getH(w);
  while (h >= height) {
    w = w - 5;
    h = getH(w);
  }
  return { w, h };
};

interface Props {
  parentWidth?: number;
  parentHeight?: number;
}
const PosterCanvas: React.FC<Props> = ({ parentWidth, parentHeight }) => {
  const poster = usePoster();
  // const [ww, wh] = useWindowSize();
  const ref = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const { w, h } = calculatePosterDims(parentWidth || 0, parentHeight || 0);
  poster.setPosterSize(w, h);
  console.log(w, h);

  useEffect(() => {
    const can = ref.current;
    if (!can) throw new Error('Unable to retreive poster canvas element');
    poster.draw(can, false);
  });

  useEffect(() => {
    const bgcan = bgRef.current;
    if (!bgcan)
      throw new Error('Unable to retreive poster background canvas element');
    poster.drawBackground(bgcan);
  }, [poster]);

  const canvasStyle = (): React.CSSProperties => {
    return {
      position: 'absolute',
    };
  };

  return (
    <>
      <canvas id='poster-bg' ref={bgRef} style={{ position: 'relative' }}>
        Poster BackGround
      </canvas>
      <canvas ref={ref} id={POSTER_CANVAS_ID} style={canvasStyle()}>
        Festival Poster Viewer
      </canvas>
    </>
  );
};

export default PosterCanvas;
