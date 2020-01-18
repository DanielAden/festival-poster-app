import React, { useState } from 'react'
import { Modal, ModalProps, ModalHeader, ModalBody } from 'reactstrap';
import { constructSpotifyAuthURL } from '../spotify/SpotifyAuth';
import useTypedSelector from '../store/rootReducer';

interface SpotifyAuthRefreshModalProps extends ModalProps {
  toggle: () => void;
}
const SpotifyAuthRefreshModal: React.FC<SpotifyAuthRefreshModalProps> = (props) => {
  const { toggle } = props;
  return (
    <Modal {...props} className='spotify-auth-refresh-modal'>
      <ModalHeader toggle={toggle}>Spotify Needs to be Re-Authorized</ModalHeader>
      <ModalBody>
        <a href={constructSpotifyAuthURL()}>Authorize Spotify</a>
      </ModalBody>
    </Modal>
  ) 
}

interface Props {
}
const GlobalError: React.FC<Props> = ( { children }) => {
  const errorData = useTypedSelector((s) => s.system.error);
  const [spotifyAccessRefreshModal, setSpotifyAccessRefreshModal] = useState(false);
  const toggleModal = () => setSpotifyAccessRefreshModal(!spotifyAccessRefreshModal);

  if (!errorData.isError) {
    if (spotifyAccessRefreshModal) setSpotifyAccessRefreshModal(false);
    return (<>{children}</>);
  }

  const { error } = errorData;

  let errorBanner;
  switch (error.type) {
    case 'NoSpotifyAccess':
      if (!spotifyAccessRefreshModal) setSpotifyAccessRefreshModal(true);
      errorBanner = null; // Modal will take care of error message
      break;
    default:
      const { error } = errorData;
      errorBanner = <h3>Error</h3>;
      console.error(error);
  }

  return (
    <>
      <SpotifyAuthRefreshModal isOpen={spotifyAccessRefreshModal} toggle={toggleModal} />
      {errorBanner}
      {children}      
    </>
  )
}


export default GlobalError;
