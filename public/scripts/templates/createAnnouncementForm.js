import { html } from 'https://unpkg.com/lit-html?module';

import { create as createAnnouncement } from '../services/announcements.js';
import { navigate } from '../utils/router.js';

const toggleError = (inputId, condition) => {
  if (condition) {
    document.getElementById(inputId).classList.add('errorInput');
  } else {
    document.getElementById(inputId).classList.remove('errorInput');
  }
};

const createAnnouncementForm = () => {
  const submitHandler = async (event) => {
    event.preventDefault();

    const {
      title: { value: title },
      category: { value: category },
      description: { value: description },
      dateUntil: { value: dateUntil },
    } = event.target;

    toggleError('create-announcement-title');
    toggleError('create-announcement-description');
    toggleError('create-announcement-category');

    const { error } = await createAnnouncement(
      title,
      description,
      category,
      dateUntil,
    );
    if (!error || !error.body) {
      document
        .getElementById('create-announcement-modal')
        .classList.add('hidden');
      navigate('');
      return;
    }
    const err = error.body;
    const {
      title: titleErr,
      description: descriptionErr,
      category: categoryErr,
    } = err;
    toggleError('create-announcement-title', titleErr);
    toggleError('create-announcement-description', descriptionErr);
    toggleError('create-announcement-category', categoryErr);
    if (titleErr || descriptionErr || categoryErr) {
      document.getElementById('create-announcement-error').innerText = [
        titleErr,
        descriptionErr,
        categoryErr,
      ]
        .filter((a) => a)
        .join(',\n');
      return;
    }

    document.getElementById('create-announcement-error').innerText =
      'An error occurred';
  };

  return html`
    <div id="create-announcement-modal" class="modal hidden">
      <form @submit=${submitHandler} class="createAnnouncementForm">
        <fieldset>
          <legend>Create an Announcement</legend>
          <label for="create-announcement-title">Title:</label>
          <input
            id="create-announcement-title"
            type="text"
            name="title"
            class="formCA"
          />

          <label for="create-announcement-description">Description: </label>
          <textarea
            id="create-announcement-description"
            name="description"
            class="formCA description"
          ></textarea>
          <label for="create-announcement-category">Category:</label>
          <select
            id="create-announcement-category"
            name="category"
            class="formCA"
          >
            <option value="fresh_food">Fresh food</option>
            <option value="nonperishable_food">Nonperishable food</option>
            <option value="others">Others</option>
          </select>
          <br />

          <label for="create-announcement-date"
            >Available until (optional):</label
          >
          <input
            id="create-announcement-date"
            name="dateUntil"
            type="date"
            class="formCA date"
          />

          <input
            type="submit"
            class="fullWidth"
            value="Create announcement"
            class="submit"
          />
          <button
            @click=${() =>
              document
                .getElementById('create-announcement-modal')
                .classList.add('hidden')}
            type="button"
            class="secondary fullWidth"
          >
            Cancel
          </button>
          <br />
          <p id="create-announcement-error"></p>
        </fieldset>
      </form>
    </div>
  `;
};

export default createAnnouncementForm;
