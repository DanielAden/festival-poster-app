import React from 'react';
import { useSelector } from 'react-redux'
import { useSpotifyAPI } from './SpotifyAPIHooks'
import { render, } from '@testing-library/react'

jest.mock('react-redux')

const testUserId = 'user id'
const testAccessToken = 'access token'


const TestComp = () => {
  const api = useSpotifyAPI();
  return (
    <div>
      {api.apiKey}
    </div>
  )
}

const setup = () => {
  const utils = render(<TestComp />)
  return utils;
}

test('useSpotifyAPI: get succesfully from User Id', () => {
  (useSelector as any).mockReturnValueOnce('');
  (useSelector as any).mockReturnValueOnce(testUserId);

  const { getByText } = setup()
  getByText(new RegExp(testUserId))
})

test('useSpotifyAPI: get succesfully from access token', () => {
  (useSelector as any).mockReturnValueOnce(testAccessToken);
  (useSelector as any).mockReturnValueOnce('');

  const { getByText } = setup();
  getByText(new RegExp(testAccessToken));
})

test('useSpotifyAPI: error is thrown correctly when no credentials', () => {
  (useSelector as any).mockReturnValueOnce('');
  (useSelector as any).mockReturnValueOnce('');

  expect(setup).toThrowError();
})

