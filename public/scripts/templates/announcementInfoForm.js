/* eslint-disable no-underscore-dangle */
import { html } from 'https://unpkg.com/lit-html?module';

import { navigate } from '../utils/router.js';

import createAnnouncementForm from './createAnnouncementForm.js';

const announcementInfo = (announcement) => {
  const logo = announcement.organization.logoAsBase64 || '/img/no_logo.png';
  return html`
    ${createAnnouncementForm()}
    <li class="announcement">
      <div>
        <img class="org_logo" height="50" width="50" src="${logo}" />

        <div class="orgBody">
          <h3>
            Kind of organization:
            ${announcement.organization.kind.toUpperCase()}
          </h3>
          <h2>
            Company Name: ${announcement.organization.companyName.toUpperCase()}
          </h2>
          <h3>Phone: ${announcement.organization.phone}</h3>
          <h3>Address: ${announcement.organization.address}</h3>
          <br />
          <br />
        </div>
      </div>
      <div>
        <div class="cardBody">
          <h2>Title: ${announcement.title}</h2>
          <br />
          <h3>Description: ${announcement.description}</h3>
        </div>

        <div>
          <div class="kind">Offer</div>
          <div class="kind">${announcement.category}</div>
        </div>
      </div>
      <div class="date">
        Available Until:
        ${`${new Date(announcement.dateUntil).getDate()}/${new Date(
          announcement.dateUntil,
        ).getMonth()}/${new Date(announcement.dateUntil).getFullYear()}`}
      </div>
      <div class="date">
        Created at:
        ${`${new Date(announcement.dateUntil).getDate()}/${new Date(
          announcement.dateUntil,
        ).getMonth()}/${new Date(announcement.dateUntil).getFullYear()}`}
      </div>
      <button @click=${() => navigate('')} type="button">
        Back
      </button>
    </li>
  `;
};

export default announcementInfo;
