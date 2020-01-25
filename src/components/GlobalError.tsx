import React, { useState } from 'react';
import { Modal, ModalProps, ModalHeader, ModalBody } from 'reactstrap';
import { constructSpotifyAuthURL } from '../spotify/SpotifyAuth';
import useTypedSelector from '../store/rootReducer';

interface SpotifyAuthRefreshModalProps extends ModalProps {
  toggle: () => void;
}
// const SpotifyAuthRefreshModal: React.FC<SpotifyAuthRefreshModalProps> = props => {
//   const { toggle } = props;
//   return (
//     <Modal {...props} className='spotify-auth-refresh-modal'>
//       <ModalHeader toggle={toggle}>
//         Spotify Is Asking To Be Authorized
//       </ModalHeader>
//       <ModalBody>
//         <a href={constructSpotifyAuthURL()}>Authorize Spotify</a>
//       </ModalBody>
//     </Modal>
//   );
// };

interface Props {}
const GlobalError: React.FC<Props> = ({ children }) => {
  const errorData = useTypedSelector(s => s.system.error);
  const [spotifyAccessRefreshModal, setSpotifyAccessRefreshModal] = useState(
    false,
  );

  const toggleModal = () =>
    setSpotifyAccessRefreshModal(!spotifyAccessRefreshModal);

  if (!errorData.isError || !errorData.error) {
    if (spotifyAccessRefreshModal) {
      toggleModal();
    }
    return <>{children}</>;
  }

  const error = errorData.error;

  let errorBanner;
  console.log(
    `isError: ${
      errorData.isError
    }, error: ${!!error}, errorData.error: ${!!errorData.error}`,
  );
  if (error) {
    switch (error.type) {
      case 'NoSpotifyAccess':
        if (!spotifyAccessRefreshModal) setSpotifyAccessRefreshModal(true);
        errorBanner = null; // Modal will take care of error message
        break;
      default:
        errorBanner = <h3>Error</h3>;
        console.error(error);
    }
  }

  return (
    <>
      {/* {spotifyAccessRefreshModal && (
        <SpotifyAuthRefreshModal
          isOpen={spotifyAccessRefreshModal}
          toggle={toggleModal}
        />
      )}
      {errorBanner} */}
      {children}
    </>
  );
};

export default GlobalError;
