import { get, post } from '../utils/api.js';

export const getAll = (organization, category, dateUntil) =>
  get(
    `/announcements?organization=${organization}&category=${category}&dateUntil=${dateUntil}`,
  );
export const getOne = (id) => get(`/announcements/${id}`);

export const getInUserCategory = () =>
  get(`/announcements?in_user_category=1&limit=5`);

export const create = (title, description, category, dateUntil) =>
  post('/announcements', {
    title,
    description,
    category,
    dateUntil,
  });
