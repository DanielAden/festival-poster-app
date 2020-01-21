import React, { useState } from 'react';
import './Toolbar.css';
import ToolbarItem from './ToolbarItem';

interface Props {}
const Toolbar: React.FC<Props> = () => {
  const [clicked, setClicked] = useState(-1);
  const handleClick = (id: number) => {
    id === clicked ? setClicked(-1) : setClicked(id);
  };

  return (
    <div className='toolbar fixed-bottom'>
      <ToolbarItem id={0} clicked={0 === clicked} handleClick={handleClick}>
        Your Artists
      </ToolbarItem>
      <ToolbarItem id={1} clicked={1 === clicked} handleClick={handleClick}>
        Customize
      </ToolbarItem>
    </div>
  );
};

export default Toolbar;
