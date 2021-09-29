import { html } from 'https://unpkg.com/lit-html?module';

import { logIn } from '../services/auth.js';
import unauthenticatedForm from './unauthenticatedForm.js';
import { getAuthError, removeAuthError } from '../utils/sessions.js';

const SUBMIT_BUTTON_ID = 'login-submit';
const loginForm = () => {
  const error = getAuthError() || '';
  const submitHandler = async (event) => {
    event.preventDefault();
    removeAuthError();
    document.getElementById('login-form-error').innerText = '';
    const button = document.getElementById(SUBMIT_BUTTON_ID);
    button.classList.add('disabled');
    button.disabled = true;

    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      await logIn(username, password);
    } catch (err) {
      // TODO: Render error.
      document.getElementById('login-form-error').innerText =
        'Incorrect credentials';
    }
    button.classList.remove('disabled');
    button.disabled = false;
  };

  return html`
    <form @submit=${submitHandler}>
      <label for="username">
        Username:
        <input name="username" type="text" required />
      </label>
      <br />
      <label for="password">
        Password:
        <input name="password" required type="password" />
      </label>
      <p id="login-form-error" class="error">${error}</p>
      <button id=${SUBMIT_BUTTON_ID} class="fullWidth" type="submit">
        Log In
      </button>
    </form>
  `;
};

export default unauthenticatedForm(loginForm, 'Go To Signup', 'signup');
