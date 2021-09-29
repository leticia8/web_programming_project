/* eslint-disable import/prefer-default-export */
import { get } from '../utils/api.js';

export const getInUserCategory = () =>
  get('/organizations?in_user_category=1&limit=5');
