import React, { useRef, useEffect, useState } from 'react';
import '../../style/Poster.css';
import { usePoster } from './Poster';
import { Spinner } from 'reactstrap';

export const POSTER_CANVAS_ID = 'poster-canvas';

const aspectRatio = [4, 5]; // 4:5
const getH = (w: number) => w * (aspectRatio[1] / aspectRatio[0]);
const maxHeight = (top: number) => document.documentElement.clientHeight - top;
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
  const [isLoading, setisLoading] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const { w: calculatedW, h: calculatedH } = calculatePosterDims(parentDomRect);
  poster.setPosterSize(calculatedW, calculatedH);
  console.log(isLoading);

  useEffect(() => {
    const { backgroundImage } = poster.theme;

    const drawPoster = async () => {
      const can = ref.current;
      if (!can) throw new Error('Unable to retreive poster canvas element');

      const bgcan = bgRef.current;
      if (!bgcan)
        throw new Error('Unable to retreive poster background canvas element');

      const redrawBG = backgroundImage !== curBackgroundImage;
      await poster.drawMultiCanvas(can, redrawBG ? bgcan : undefined);
      setCurBackgroundImage(backgroundImage);
      setCurDims([calculatedW, calculatedH]);
      setisLoading(false);
    };
    // Only display loading if background is being updated
    if (backgroundImage !== curBackgroundImage) setisLoading(true);
    drawPoster();
  }, [poster, calculatedW, curW, calculatedH, curH, curBackgroundImage]);

  const canvasStyle = (): React.CSSProperties => {
    return {
      position: 'absolute',
    };
  };

  return (
    <>
      {isLoading && <Spinner style={{ width: '3rem', height: '3rem' }} />}
      <canvas id='poster-bg' ref={bgRef} style={canvasStyle()}>
        Poster BackGround
      </canvas>
      <canvas ref={ref} id={POSTER_CANVAS_ID} style={canvasStyle()}>
        Festival Poster Viewer
      </canvas>
    </>
  );
};

export default PosterCanvas;
