import { getSessionToken } from './sessions.js';

// eslint-disable-next-line import/prefer-default-export
export const isAuthenticated = () => !!getSessionToken();
