import { html, render } from 'https://unpkg.com/lit-html?module';

import { logOut } from './services/auth.js';

import searchAnnForm from './templates/searchAnnForm.js';
import createAnnouncement from './templates/createAnnouncementForm.js';

const submitHandler = async (event) => {
  event.preventDefault();
  try {
    render(createAnnouncement(), document.getElementById('create'));
  } catch (err) {
    document.getElementById('search-ann-error').innerText =
      'No announcements to show';
  }
};
const authenticatedApp = () => html`
  ${searchAnnForm()}
  <form @submit=${submitHandler}>
    <input
      type="submit"
      class="fullWidth"
      value="Create Announcement"
      class="submit"
    />
  </form>
  <p id="create"></p>
  <button class="fullWidth" @click=${logOut} type="button">Log Out</button>
`;

export default authenticatedApp;
