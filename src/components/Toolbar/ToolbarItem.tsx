import React from 'react';
import './Toolbar.css';

export interface ToolbarItemProps {
  id: string;
  currentClickedId: string;
  handleClick: (id: string) => void;
}
export const ToolbarItem: React.FC<ToolbarItemProps> = ({
  id,
  currentClickedId,
  children,
  handleClick,
}) => {
  const bgColor = currentClickedId === id ? 'lime' : '';
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
