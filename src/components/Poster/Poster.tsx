import React, { useRef, useEffect } from 'react';
import '../../style/Poster.css';
import { usePosterTheme, usePosterSize } from './PosterThemes';

interface Props {
  themeType?: string;
}
const Poster: React.FC<Props> = ({ themeType = 'theme1' }) => {
  const [posterWidth, posterHeight] = usePosterSize();
  const theme = usePosterTheme();
  const ref = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const can = ref.current;
    if (!can) throw new Error('Unable to retreive poster canvas element');
    theme.draw(can, false);
  });

  useEffect(() => {
    const bgcan = bgRef.current;
    if (!bgcan)
      throw new Error('Unable to retreive poster background canvas element');
    theme.drawBackground(bgcan);
  }, [theme]);

  const canvasStyle = (): React.CSSProperties => {
    return {
      position: 'absolute',
    };
  };

  return (
    <div
      className='canvas-container'
      style={{
        position: 'relative',
        width: posterWidth,
        height: posterHeight,
        border: '3px solid',
        boxSizing: 'content-box',
      }}
    >
      <canvas
        width={posterWidth}
        height={posterHeight}
        ref={bgRef}
        id='poster-bg'
        style={canvasStyle()}
      >
        Poster BackGround
      </canvas>
      <canvas ref={ref} id='poster' style={canvasStyle()}>
        Festival Poster Viewer
      </canvas>
    </div>
  );
};

export default Poster;
