import React from 'react';
import './Toolbar.css';

export interface ToolbarItemProps {
  id: number;
  clicked?: boolean;
  handleClick: (id: number) => void;
}
const ToolbarItem: React.FC<ToolbarItemProps> = ({
  id,
  clicked,
  children,
  handleClick,
}) => {
  const bgColor = clicked ? 'lime' : '';
  return (
    <div
      className='toolbar__item'
      onClick={e => handleClick(id)}
      style={{
        backgroundColor: bgColor,
      }}
    >
      {children}
    </div>
  );
};

export default ToolbarItem;
