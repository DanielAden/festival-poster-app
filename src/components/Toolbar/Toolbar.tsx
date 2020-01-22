import React, { useState, useRef, useEffect } from 'react';
import './Toolbar.css';
import { ToolbarItem, ToolbarWindow } from './';
import { useBoundingRectangle } from '../../utils';

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
  }, [rect, setWindowHeight]);

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
