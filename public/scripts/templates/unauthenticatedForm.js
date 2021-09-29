import { html } from 'https://unpkg.com/lit-html?module';
import { navigate } from '../utils/router.js';
import aboutus from './aboutus.js';

const unauthenticatedForm = (form, buttonText, ...route) => () => {
  const changeTab = () => {
    navigate(...route);
  };

  return html`
    <div id="unauthenticated-form" class="centered login">
      <img src="img/logo.png" class="logo" />
      <h1>Sharity</h1>
      <div id="unauthenticated=form">
        ${form()}
      </div>
      <button class="fullWidth" @click=${changeTab}>
        ${buttonText}
      </button>
    </div>
    <footer>
      ${aboutus()}
    </footer>
  `;
};

export default unauthenticatedForm;
