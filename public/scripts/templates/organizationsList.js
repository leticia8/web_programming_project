/* eslint-disable no-underscore-dangle */
import { html } from 'https://unpkg.com/lit-html?module';

export const organizationItem = (organization) => {
  const logo = organization.logoAsBase64 || '/img/no_logo.png';
  return html`
    <li class="announcement">
      <div>
        <img class="org_logo" height="50" width="50" src="${logo}" />
        <div class="cardBody">
          <h3>${organization.address}</h3>
          <h2>${organization.companyName}</h2>
          <p>${organization.phone}</p>
        </div>
      </div>
    </li>
  `;
};

const organizationsList = (organizations) => {
  if (organizations === null) {
    return html`<p>Unable to retrieve organizations.</p>`;
  }
  if (organizations.length === 0) {
    return html`<p>No other organization in your category have signed up!</p>`;
  }
  return html`<ul class="announcements">
    ${organizations.map(organizationItem)}
  </ul>`;
};

export default organizationsList;
