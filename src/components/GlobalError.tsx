import React, { useState } from 'react'
import { useGlobalError, useGlobalErrorDispatch } from '../store/system/useGlobalError'
import { useDispatch } from 'react-redux';
import { setSystemSpotifyAccessToken, setSystemSpotifyAccessTokenExpiresAt } from '../store/system/actions';
import { Modal, ModalProps, ModalHeader, ModalBody } from 'reactstrap';
import { constructSpotifyAuthURL } from '../spotify/SpotifyAuth';


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
  const { errorMsg, errorType, isError } = useGlobalError();
  const dispatch = useDispatch();
  const [sarModal, setSarModal] = useState(false);
  const toggle = () => setSarModal(!sarModal);

  let errorBanner;
  if (!isError) {
    errorBanner = null;
  } else if (errorType === 'AuthExpiredError') {
    dispatch(setSystemSpotifyAccessToken(''));
    dispatch(setSystemSpotifyAccessTokenExpiresAt(''));
    if (!sarModal) setSarModal(true);
  } else {
    errorBanner = (!isError) ? null : (
      <div>
        <h1>{`ERROR: ${errorMsg}`}</h1>
        <h2>{`Type: ${errorType}`}</h2>
      </div>
    )
  }
  return (
    <>
      <SpotifyAuthRefreshModal isOpen={sarModal} toggle={toggle} />
      {errorBanner}
      {children}      
    </>
  )
}


export default GlobalError;
