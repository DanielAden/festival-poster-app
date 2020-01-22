import React from 'react';
import './SideNav.css';
import TopArtistsList from '../TopArtistsList';

interface Props {
  active: boolean;
  toggle: () => void;
}
const SideNav: React.FC<Props> = ({ active, toggle }) => {
  const width = active ? 300 : 0;
  console.log(active);
  return (
    <div className='sidenav' style={{ width }}>
      <a href='#' className='closebtn' onClick={toggle}>
        &times;
      </a>
      <TopArtistsList />
    </div>
  );
};

export default SideNav;
