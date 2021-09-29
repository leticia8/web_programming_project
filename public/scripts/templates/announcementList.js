/* eslint-disable no-underscore-dangle */
import { html } from 'https://unpkg.com/lit-html?module';

import resolvePromise from '../directives/resolvePromise.js';
import { getAll as getAllAnnouncements } from '../services/announcements.js';
import { navigate } from '../utils/router.js';

const readableCategory = {
  others: 'Others',
  nonperishable_food: 'Non-perishable',
  fresh_food: 'Fresh',
};

export const announcementItem = (announcement) => {
  const logo = announcement.organization.logoAsBase64 || '/img/no_logo.png';
  return html`
    <li class="announcement">
      <div>
        <img class="org_logo" height="50" width="50" src="${logo}" />
        <div class="cardBody">
          <h3>${announcement.organization.companyName}</h3>
          <h2>${announcement.title}</h2>
        </div>
        <div>
          <div class="kind">Offer</div>
          <div class="kind">${readableCategory[announcement.category]}</div>
        </div>
      </div>
      ${`${new Date(announcement.dateUntil).getDate()}/${new Date(
        announcement.dateUntil,
      ).getMonth()}/${new Date(announcement.dateUntil).getFullYear()}`}
      <button
        @click=${() => navigate('announcementInfo', announcement._id)}
        type="button"
      >
        See more
      </button>
    </li>
  `;
};

export const announcementList = (announcements) => {
  if (announcements === null) {
    return html`<p>Unable to retrieve announcement.</p>`;
  }
  if (announcements.length === 0) {
    return html`<p>You don't have any announcements!</p>`;
  }
  return html`<ul class="announcements">
    ${announcements.map(announcementItem)}
  </ul>`;
};

const filteredAnnouncementList = (organization, category, dateUntil) => {
  const fetchAnnouncements = async () => {
    const { data: announcements } = await getAllAnnouncements(
      organization,
      category,
      dateUntil,
    );
    return announcementList(announcements);
  };

  return html`${resolvePromise(fetchAnnouncements())}`;
};

export default filteredAnnouncementList;
