import React, { useRef, useEffect, useState } from 'react';
import '../../style/Poster.css';
import { usePoster } from './Poster';

export const POSTER_CANVAS_ID = 'poster-canvas';

const aspectRatio = [4, 5]; // 4:5
const getH = (w: number) => w * (aspectRatio[1] / aspectRatio[0]);
const maxHeight = (top: number) => window.innerHeight - top;
const calculatePosterDims = (r?: DOMRect) => {
  if (!r) return { w: 0, h: 0 };
  let w = r.width;
  let h = getH(w);
  while (h >= maxHeight(r.top)) {
    w = w - 5;
    h = getH(w);
  }
  return { w, h };
};

interface Props {
  parentDomRect?: DOMRect;
}
const PosterCanvas: React.FC<Props> = ({ parentDomRect }) => {
  const poster = usePoster();
  const [curBackgroundImage, setCurBackgroundImage] = useState('');
  const [[curW, curH], setCurDims] = useState([0, 0]);
  const ref = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const { w: calculatedW, h: calculatedH } = calculatePosterDims(parentDomRect);
  poster.setPosterSize(calculatedW, calculatedH);

  useEffect(() => {
    const can = ref.current;
    if (!can) throw new Error('Unable to retreive poster canvas element');
    poster.draw(can, false);
  });

  useEffect(() => {
    const { backgroundImage } = poster.theme;
    if (calculatedW === 0 || calculatedH === 0) return;
    if (
      backgroundImage === curBackgroundImage &&
      calculatedW === curW &&
      calculatedH === curH
    )
      return;

    const bgcan = bgRef.current;
    if (!bgcan)
      throw new Error('Unable to retreive poster background canvas element');

    poster.drawBackground(bgcan);
    setCurBackgroundImage(backgroundImage);
    setCurDims([calculatedW, calculatedH]);
  }, [calculatedH, calculatedW, curBackgroundImage, curH, curW, poster]);

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
