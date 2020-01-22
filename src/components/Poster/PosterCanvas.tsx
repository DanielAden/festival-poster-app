import React, { useRef, useEffect } from 'react';
import '../../style/Poster.css';
import { usePoster } from './Poster';

export const POSTER_CANVAS_ID = 'poster-canvas';

const calculatePosterDims = (parentWidth?: number) => {
  const aspectRatio = 3 / 2; // 2:3
  const defaultDims = { w: 600, h: 900 };
  if (parentWidth === undefined) return defaultDims;
  if (parentWidth > 600) return defaultDims;
  const w = parentWidth;
  const h = Math.ceil(w * aspectRatio);
  return { w, h };
};

interface Props {
  parentWidth?: number;
}
const PosterCanvas: React.FC<Props> = ({ parentWidth }) => {
  const poster = usePoster();
  const ref = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const { w, h } = calculatePosterDims(parentWidth);
  poster.setPosterSize(w, h);

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
      <canvas id='poster-bg' ref={bgRef} style={{ position: 'absolute' }}>
        Poster BackGround
      </canvas>
      <canvas ref={ref} id={POSTER_CANVAS_ID} style={canvasStyle()}>
        Festival Poster Viewer
      </canvas>
    </>
  );
};

export default PosterCanvas;
