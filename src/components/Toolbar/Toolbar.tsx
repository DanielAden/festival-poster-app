import React, { useState, useRef, useEffect } from 'react';
import './Toolbar.css';
import { ToolbarItem, ToolbarWindow } from './';

type UseBoundingRectangle<T> = [DOMRect | null, React.RefObject<T>];
function useBoundingRectangle<T extends HTMLElement>(): UseBoundingRectangle<
  T
> {
  const [rect, setrect] = useState<DOMRect | null>(null);
  const ref = useRef<T>(null);
  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    setrect(rect || null);
  }, [ref]);
  return [rect, ref];
}

interface Props {}
export const Toolbar: React.FC<Props> = ({ children }) => {
  const [clickedId, setclickedId] = useState('');
  const [windowActive, setWindowActive] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [rect, ref] = useBoundingRectangle<HTMLDivElement>();

  const handleClick = (id: string) => {
    if (id === clickedId) {
      setclickedId('');
      setWindowActive(false);
      return;
    }
    setclickedId(id);
    setWindowActive(true);
    console.log(id);
  };

  const handleWindowClose = () => {
    setWindowActive(false);
    setclickedId('');
  };

  useEffect(() => {
    const toolbarHeight = rect?.height || 0;
    setWindowHeight(window.outerHeight - toolbarHeight);
  }, [setWindowHeight, rect]);

  return (
    <div ref={ref} className='toolbar'>
      {/* <ToolbarWindow active={windowActive} close={handleWindowClose} /> */}
      <ToolbarItem
        currentClickedId={clickedId}
        id={'My Artists'}
        handleClick={handleClick}
      >
        My Artists
      </ToolbarItem>
    </div>
  );
};
