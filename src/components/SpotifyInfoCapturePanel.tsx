import React from 'react'
import { getSpotifyAuth, constructSpotifyAuthURL } from '../spotify/SpotifyAuth';
import { useDispatch } from 'react-redux';
import { setSystemSpotifyAccessToken } from '../store/system/actions';
import { Redirect } from 'react-router-dom';
import { Container, Row, } from 'reactstrap'
import AppInput, { InputValidator } from './AppInput/AppInput';

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
  const dispatch = useDispatch()
  const authData = getSpotifyAuth()

  if (authData.status === 'AUTHORIZED' && authData.data) {
    const data = authData.data;
    dispatch(setSystemSpotifyAccessToken(data.access_token));
    return (
      <Redirect to={{
        pathname: '/',
      }} />
    )
  }

  const uriFormatValidator: InputValidator = (input: string) => {
    const userId = parseUserIdFromURI(input);
    if (!userId) return {isValid: false, errorMsg: invalidURIMsg }
    return { isValid: true }
  }

  const handleSubmit = (text: string) => {
    console.log('submitted')
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
