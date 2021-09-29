// eslint-disable-next-line import/no-cycle
import { post } from '../utils/api.js';
import {
  removeSessionToken,
  setSessionToken,
  setAuthError,
  setSessionKind,
  removeSessionKind,
} from '../utils/sessions.js';
import { navigate } from '../utils/router.js';

export const logIn = async (username, password) => {
  const { data: session, error } = await post('/tokens', {
    username,
    password,
  });
  if (error) {
    if (error.status === 401) {
      throw new Error('Invalid username/password combination.');
    }

    throw new Error('Oops! Something went wrong...');
  }

  setSessionToken(session.token);
  setSessionKind(session.kind);

  navigate('');
};

export const signUp = async (
  username,
  password,
  kind,
  category,
  address,
  phone,
  companyName,
  logo,
) => {
  const { error } = await post('/organizations', {
    username,
    password,
    kind,
    category,
    address,
    phone,
    companyName,
    logo,
  });
  if (error) {
    if (error.status === 409) {
      throw error.body;
    } else if (error.status === 400) {
      throw error.body;
    }
    throw new Error('Oops! Something went wrong...');
  }

  try {
    await logIn(username, password);
  } catch (_err) {
    navigate('login');
  }
};

export const logOut = (authError = '') => {
  removeSessionToken();
  removeSessionKind();
  setAuthError(authError);
  navigate('login');
};
