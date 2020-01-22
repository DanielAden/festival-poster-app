import React from 'react';
import './SideNav.css';
import TopArtistsList from '../TopArtistsList';
import SpotifyInfoCapturePanel from '../SpotifyInfoCapturePanel';
import useSpotifyAccessToken from '../../store/system/useSpotifyAccessToken';

interface Props {
  active: boolean;
  toggle: () => void;
}
const SideNav: React.FC<Props> = ({ active, toggle }) => {
  const width = active ? 300 : 0;
  const data = useSpotifyAccessToken();
  const showAuth = data.status !== 'VALID';

  return (
    <div className='sidenav ' style={{ width }}>
      <a href='#' className='closebtn' onClick={toggle}>
        &times;
      </a>
      {showAuth && <SpotifyInfoCapturePanel />}
      {!showAuth && <TopArtistsList />}
    </div>
  );
};

export default SideNav;
