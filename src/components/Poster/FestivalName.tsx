import React, { useState, useRef, useEffect } from 'react'

const FONT_SIZE = '5rem';

interface Props {
  posterRect: DOMRect | null;
}
const FestivalName: React.FC<Props> = ({posterRect}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (!posterRect) return;
    if (!rect) return;
    const left = (posterRect.width/2) - (rect.width/2);
    setLeft(left);
  }, [posterRect,])

  const style = (): React.CSSProperties => {
    return {
      position: 'absolute',
      textAlign: 'center',
      color: 'white',
      left,
      fontSize: FONT_SIZE,
      textShadow: '#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 15px, #FF2D95 0px 0px 20px, #FF2D95 0px 0px 30px, #FF2D95 0px 0px 40px, #FF2D95 0px 0px 50px, #FF2D95 0px 0px 75px',
    }
  }
  return (
    <div ref={ref} style={style()}>
      <div>My Festival</div>
    </div>
  )
}

export default FestivalName
