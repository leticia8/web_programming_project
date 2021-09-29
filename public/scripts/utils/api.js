import { getSessionToken } from './sessions.js';
// eslint-disable-next-line import/no-cycle
import { logOut } from '../services/auth.js';

const baseUrl = '/.netlify/functions';

const fetch = async (url, method, data) => {
  const headers = new Headers();

  const token = getSessionToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  let body;
  if (data) {
    headers.append('Content-Type', 'application/json');
    body = JSON.stringify(data);
  }

  const response = await window.fetch(`${baseUrl}${url}`, {
    method,
    headers,
    body,
  });
  if (!response.ok) {
    if (response.status === 401) {
      logOut('Session expired');
    }
    return { error: { status: response.status, body: await response.json() } };
  }

  return { data: await response.json() };
};

export const get = (url) => fetch(url, 'GET');

export const post = (url, data) => fetch(url, 'POST', data);
