import React from 'react';

interface Props {
  active: boolean;
  close: () => void;
}

export const ToolbarWindow: React.FC<Props> = ({ close, active }) => {
  const activeClass = active
    ? 'toolbar-window-active'
    : 'toolbar-window-inactive';
  return (
    <div className={`toolbar-window ${activeClass}`} style={{}}>
      <button onClick={() => close()}>XXX</button>
      <a href='/'>About</a>
      <a href='/'>Services</a>
      <a href='/'>Clients</a>
      <a href='/'>Contact</a>
    </div>
  );
};
