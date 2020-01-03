import React, { useState } from 'react'
import { constructSpotifyAuthURL } from '../spotify/SpotifyAuth';
import { useDispatch } from 'react-redux';
import { setSystemSpotifyUserId } from '../store/system/actions';
import { Container, Row, } from 'reactstrap'
import AppInput, { InputValidator } from './AppInput/AppInput';
import { useMe } from '../spotify/SpotifyAPIHooks';
import AppButton from './AppButton'

const centerContent = 'justify-content-md-center';
const uriFormText = `Enter a Spotify User URI`;
const userIdFormat = 'spotify:user:yourid';
const invalidURIMsg = `Invalid Spotify URI. Format should be '${userIdFormat}'`;
const testURI = 'spotify:user:1238922402'

function parseUserIdFromURI(uri: string) {
  const uriParts = uri.split(':')
  if (uriParts.length !== 3) return;
  if (uriParts[0] !== 'spotify' || uriParts[1] !== 'user') return;
  const userId = uriParts[2];
  if (userId === '') return;
  return userId;
}

interface Props {
  
}
const SpotifyInfoCapturePanel: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const [userId, setuserId] = useState('');
  const meData = useMe()

  const userIdIsInvalid = () => {
    if (userId === '') return false;
    if (meData === null) return false;
    if (!('error' in meData)) return false;
    if (meData.errorType === 'ResourceNotFound') return true;
    return false;
  }

  const renderUserIdTryAgain = () => {
    return (
      <Container>
        <Row>
          <h3>{`Could Not Connect to Spotify With Provided User Id`}</h3>
        </Row>
        <Row>
          <AppButton>Try Again</AppButton>
        </Row>
      </Container>
    )
  }

  if (userIdIsInvalid()) {
    setuserId('');
    dispatch(setSystemSpotifyUserId(''));
    return renderUserIdTryAgain();
  }

  const uriFormatValidator: InputValidator = (input: string) => {
    const userId = parseUserIdFromURI(input);
    if (!userId) return {isValid: false, errorMsg: invalidURIMsg }
    return { isValid: true }
  }

  const handleSubmit = (text: string) => {
    setuserId(text);
    return { isValid: true };
  }

  return (
    <Container>
      <Row className={`${centerContent}`}>
        <a href={constructSpotifyAuthURL()} className="btn btn-success btn-lg"  role="button">Authorize Your Spotify Account</a>
      </Row>
      <Row className={`${centerContent}`}>
        OR
      </Row>
      <Row className={`${centerContent}`}>
        {uriFormText}
      </Row>
      <AppInput placeholder={userIdFormat} 
                bsSize="lg" 
                validations={[uriFormatValidator]}
                submittable
                submitHook={handleSubmit}></AppInput>
      {testURI}
    </Container>
  )
}

export default SpotifyInfoCapturePanel;
