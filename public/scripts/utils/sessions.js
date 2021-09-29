const tokenStorageKey = 'token';
const authErrorKey = 'authError';
const userKindKey = 'userKind';

export const getSessionKind = () => {
  return window.localStorage.getItem(userKindKey);
};

export const setSessionKind = (token) => {
  window.localStorage.setItem(userKindKey, token);
};

export const removeSessionKind = () => {
  window.localStorage.removeItem(userKindKey);
};

export const getSessionToken = () => {
  return window.localStorage.getItem(tokenStorageKey);
};

export const setSessionToken = (token) => {
  window.localStorage.setItem(tokenStorageKey, token);
};

export const removeSessionToken = () => {
  window.localStorage.removeItem(tokenStorageKey);
};

export const getAuthError = () => {
  return window.localStorage.getItem(authErrorKey);
};

export const setAuthError = (error) => {
  window.localStorage.setItem(authErrorKey, error);
};

export const removeAuthError = () => {
  window.localStorage.removeItem(authErrorKey);
};
