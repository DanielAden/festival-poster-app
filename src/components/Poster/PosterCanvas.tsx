import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  w = Math.floor(w);
  h = Math.floor(h);
  return { w, h };
};

interface Props {
  parentDomRect?: DOMRect;
}
const PosterCanvas: React.FC<Props> = ({ parentDomRect }) => {
  const poster = usePoster();
  const [curBackgroundImage, setCurBackgroundImage] = useState('');
  const [curW, setCurW] = useState(0);
  const [curH, setCurH] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);

  const { w: calculatedW, h: calculatedH } = calculatePosterDims(parentDomRect);
  const { backgroundImage } = poster.theme;
  poster.setPosterSize(calculatedW, calculatedH);

  const needBackgroundImageUpdate = useCallback(() => {
    return (
      backgroundImage !== curBackgroundImage ||
      curW !== calculatedW ||
      curH !== calculatedH
    );
  }, [
    backgroundImage,
    calculatedH,
    calculatedW,
    curBackgroundImage,
    curH,
    curW,
  ]);

  const needPosterUpdate = useCallback(() => {
    if (calculatedW === 0 || calculatedH === 0) return false;
    return true;
  }, [calculatedH, calculatedW]);

  useEffect(() => {
    const drawPoster = async () => {
      const can = ref.current;
      if (!can) throw new Error('Unable to retreive poster canvas element');

      const bgcan = bgRef.current;
      if (!bgcan)
        throw new Error('Unable to retreive poster background canvas element');

      const redrawBG = needBackgroundImageUpdate();
      console.log(redrawBG);
      if (redrawBG) setisLoading(true);
      await poster.drawMultiCanvas(can, redrawBG ? bgcan : undefined);
      setisLoading(false);
      setCurBackgroundImage(poster.theme.backgroundImage);
      setCurW(poster.w);
      setCurH(poster.h);
    };
    if (needPosterUpdate()) {
      drawPoster();
    }
  }, [needPosterUpdate, needBackgroundImageUpdate, poster]);

  const canvasStyle = (): React.CSSProperties => {
    return {
      position: 'absolute',
    };
  };

  return (
    <>
      {isLoading && (
        <Spinner style={{ width: '3rem', height: '3rem', zIndex: 99 }} />
      )}
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
