import {API_ROUTES_AUTH_HEADER} from './constants';

export async function fetcher(url: string, token?: string) {
  const option = token
    ? {
        headers: {
          [API_ROUTES_AUTH_HEADER]: token,
        },
      }
    : {};

  const res = await fetch(url, option);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify({...json, statusCode: res.status}));
  }
  return json;
}
