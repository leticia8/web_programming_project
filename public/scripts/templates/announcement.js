import { html } from 'https://unpkg.com/lit-html?module';

import allAnnouncementList from './announcementList.js';

const announcements = (organization, category, dateUntil) => html`
  <h2>List of announcements:</h2>
  ${allAnnouncementList(organization, category, dateUntil)}
`;

export default announcements;
