import {SPOTIFY_API_HOST, apiurl} from './APIRequest'

test('spotify api url', () => {
  let res = apiurl('test1', 'test2', 'test3');
  expect(res).toBe(`${SPOTIFY_API_HOST}/v1/test1/test2/test3`)
})