import { html } from 'https://unpkg.com/lit-html?module';
import resolvePromise from '../directives/resolvePromise.js';
import { getGreeting } from '../services/greeting.js';
import { getInUserCategory as getAnnouncementInUserCategory } from '../services/announcements.js';
import { announcementList } from './announcementList.js';
import { getInUserCategory as getOrganizationInUserCategory } from '../services/organizations.js';
import createAnnouncementForm from './createAnnouncementForm.js';
import organizationsList from './organizationsList.js';
import navbar from './navbar.js';

const greeting = async () => {
  let salute;
  try {
    salute = (await getGreeting()).data;
  } catch (err) {
    salute = 'Hey, yo!';
  }
  // prettier-ignore
  return html`
    <section class="greeting">
      <p>${salute}</p>
    </section>`;
};

const listOfAnnouncementsInUserCategory = async () => {
  const { data: announcements } = await getAnnouncementInUserCategory();
  return html` <section>
    <h2>Relevant Announcements</h2>
    ${announcementList(announcements)}
  </section>`;
};

const listOfOrganizationsInUserCategory = async () => {
  const { data: organizations } = await getOrganizationInUserCategory();
  return html` <section>
    <h2>Related Organizations</h2>
    ${organizationsList(organizations)}
  </section>`;
};

export const spinner = () => html`<div class="loader"></div>`;

const dashboardBody = async () => {
  return html`
    ${await greeting()}
    <section class="main">
      ${await listOfAnnouncementsInUserCategory()}
      ${await listOfOrganizationsInUserCategory()}
    </section>
    ${createAnnouncementForm()}
  `;
};

const dashboardScreen = () => {
  return html` ${navbar()} ${resolvePromise(dashboardBody(), spinner())} `;
};

export default dashboardScreen;
