import React, { useRef, useEffect } from 'react';
import '../../style/Poster.css';
import { usePoster } from './Poster';

export const POSTER_CANVAS_ID = 'poster-canvas';

interface Props {
  themeType?: string;
}
const PosterCanvas: React.FC<Props> = ({ themeType = 'theme1' }) => {
  const poster = usePoster();
  const ref = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);

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
