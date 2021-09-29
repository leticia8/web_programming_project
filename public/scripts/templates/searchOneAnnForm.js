/* eslint-disable no-underscore-dangle */
import { html } from 'https://unpkg.com/lit-html?module';

import { getOne as getOneAnnouncement } from '../services/announcements.js';

import resolvePromise from '../directives/resolvePromise.js';

import announcementInfo from './announcementInfoForm.js';

import { spinner } from './dashboardScreen.js';
import navbar from './navbar.js';

const searchAnnouncementForm = async (announcementId) => {
  let oneAnnouncement;
  try {
    oneAnnouncement = await getOneAnnouncement(announcementId);
  } catch (err) {
    // eslint-disable-next-line spaced-comment
    document.getElementById('see-one-announcement-error').innerText =
      'Announcement not found';
  }
  return html`
    ${navbar()}
    ${resolvePromise(announcementInfo(oneAnnouncement.data), spinner)}
    <p class="error" id="see-one-announcement-error"></p>
  `;
};
export default searchAnnouncementForm;
