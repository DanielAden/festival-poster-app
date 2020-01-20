import React, { useRef, useEffect } from 'react';
import '../../style/Poster.css';
import { usePosterTheme } from './PosterThemes';

interface Props {
  themeType?: string;
}
const Poster: React.FC<Props> = ({ themeType = 'theme1' }) => {
  const theme = usePosterTheme();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const can = ref.current;
    if (!can) throw new Error('Unable to retreive poster canvas element');
    theme.draw(can);
  });

  const style = (): React.CSSProperties => {
    return {
      border: '3px solid',
    };
  };

  return (
    <canvas ref={ref} id='poster' style={style()}>
      Festival Poster Viewer
    </canvas>
  );
};

export default Poster;
