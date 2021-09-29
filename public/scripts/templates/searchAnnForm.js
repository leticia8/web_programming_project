import { html, render } from 'https://unpkg.com/lit-html?module';

import announcements from './announcement.js';
import navbar from './navbar.js';
import createAnnouncementForm from './createAnnouncementForm.js';

const searchAnnForm = () => {
  const submitHandler = async (event) => {
    event.preventDefault();
    const category = event.target.category.value;
    const dateUntil = event.target.dateUntil.value;
    const organization = event.target.organization.value;

    try {
      render(
        announcements(
          organization !== '' ? organization : ' ',
          category,
          dateUntil,
        ),
        document.getElementById('list-ann'),
      );
    } catch (err) {
      document.getElementById('search-ann-error').innerText =
        'No announcements to show';
    }
  };
  return html`
    ${navbar(true)} ${createAnnouncementForm()}
    <link rel="stylesheet" href="./styles/searchAnnouncement.css" />
    <link rel="stylesheet" href="./styles/index.css" />

    <div class="search">
      <form @submit=${submitHandler} class="search-announcement">
        <legend class="search">SEARCH ANNOUNCEMENT</legend>
        <div class="search-bar">
          <input
            id="search-org"
            type="text"
            name="organization"
            placeholder="Insert organization name"
          />

          <select name="category" id="search-select">
            <option value="">Select a category</option>
            <option value="Fresh_food">Fresh food</option>
            <option value="Nonperishable_food">Nonperishable food</option>
            <option value="Others">Others</option>
          </select>

          <label for="search-date" id="search-labanddate">
            Available until:
            <input name="dateUntil" id="date" type="date" />
          </label>

          <input type="submit" value="Go!" class="submit-search" />
        </div>
        <p id="search-ann-error" class="error"></p>
      </form>
    </div>
    <div id="list-ann"></div>
    <div id="create-announcement-modal"></div>
  `;
};

export default searchAnnForm;
