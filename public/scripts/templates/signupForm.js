import { html } from 'https://unpkg.com/lit-html?module';
import { signUp } from '../services/auth.js';
import unauthenticatedForm from './unauthenticatedForm.js';

const formInput = (name, label, type) => html`
  <label for="${name}">
    ${label}:
    <input name="${name}" type="${type}" id="form-input-${name}" />
  </label>
`;

const radioInput = (name, label, value) => html`
  <input type="radio" name="${name}" value="${value}" />
  <label for="${name}">${label}</label>
`;

const SUBMIT_BUTTON_ID = 'signup-submit';

const loadImgAsBase64 = (fileInput) =>
  new Promise((resolve) => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        resolve(reader.result);
      },
      false,
    );

    if (file) {
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });

const signupForm = () => {
  const submitHandler = async (event) => {
    event.preventDefault();
    document.getElementById('form-signup-error').innerText = '';
    [
      'category',
      'companyName',
      'address',
      'phone',
      'logo',
      'username',
      'password',
      'password-repeat',
    ].forEach((field) => {
      document
        .getElementById(`form-input-${field}`)
        .classList.remove('errorInput');
    });

    const button = document.getElementById(SUBMIT_BUTTON_ID);
    button.classList.add('disabled');
    button.disabled = true;
    const {
      kind: { value: kind },
      category: { value: category },
      address: { value: address },
      phone: { value: phone },
      username: { value: username },
      password: { value: password },
      'password-repeat': { value: passwordRepeat },
      companyName: { value: companyName },
    } = event.target;
    if (password !== passwordRepeat) {
      document
        .getElementById(`form-input-password-repeat`)
        .classList.add('errorInput');
      document.getElementById('form-signup-error').innerText =
        'Passwords do not match';
      button.classList.remove('disabled');
      button.disabled = false;
      return;
    }

    const logo = await loadImgAsBase64(
      document.getElementById('form-input-logo'),
    );

    try {
      await signUp(
        username,
        password,
        kind,
        category,
        address,
        phone,
        companyName,
        logo,
      );
    } catch (err) {
      [
        'category',
        'companyName',
        'address',
        'phone',
        'username',
        'password',
      ].forEach((field) => {
        if (err[field]) {
          document
            .getElementById(`form-input-${field}`)
            .classList.add('errorInput');
          document.getElementById('form-signup-error').innerText += err[field];
          document.getElementById('form-signup-error').innerText += '.\n';
        }
      });
    }
    button.classList.remove('disabled');
    button.disabled = false;
  };

  const previewFile = async () => {
    const preview = document.getElementById('signup-logo-preview');
    const fileInput = document.getElementById('form-input-logo');

    const base64Encoding = await loadImgAsBase64(fileInput);
    if (base64Encoding) {
      preview.src = base64Encoding;
    }
  };

  return html`
    <form @submit=${submitHandler}>
      <div class="row">
        ${radioInput('kind', 'ONG', 'ong')}
        ${radioInput('kind', 'Company', 'company')}
      </div>
      <label for="category">
        Choose a donation category:
        <select name="category" class="formCA" id="form-input-category">
          <option value="fresh_food">Fresh food</option>
          <option value="nonperishable_food">Nonperishable food</option>
          <option value="others">Others</option>
        </select>
      </label>
      <label for="logo">
        Company Logo:
        <input
          id="form-input-logo"
          name="logo"
          type="file"
          @change=${previewFile}
        />
        <img
          id="signup-logo-preview"
          style="object-fit: contain;"
          src=""
          width="160"
          height="80"
          alt="Image preview..."
        />
      </label>
      ${formInput('companyName', 'Name of the Organization', 'text')}
      ${formInput('address', 'Address', 'text')}
      ${formInput('phone', 'Phone Number', 'tel')}
      ${formInput('username', 'Username', 'text')}
      ${formInput('password', 'Password', 'password')}
      ${formInput('password-repeat', 'Please repeat your password', 'password')}
      <p class="error" id="form-signup-error"></p>
      <button id="${SUBMIT_BUTTON_ID}" class="fullWidth" type="submit">
        Sign Up
      </button>
    </form>
  `;
};

export default unauthenticatedForm(signupForm, 'Go To Login', 'login');
