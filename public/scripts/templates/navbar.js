import { html } from 'https://unpkg.com/lit-html?module';
import { navigate } from '../utils/router.js';
import { getSessionKind } from '../utils/sessions.js';
import { logOut } from '../services/auth.js';

const navbar = (hideSearch = false) => {
  const organizationKind = getSessionKind();
  const showCreateAnnouncementModal = () => {
    const modal = document.getElementById('create-announcement-modal');
    modal.classList.remove('hidden');
  };
  if (hideSearch) {
    return html`
      <header>
        <nav>
          <a href="/">
            <h1>Sharity</h1>
          </a>
          <div>
            <button @click=${showCreateAnnouncementModal} type="button">
              Add ${organizationKind === 'ong' ? 'Request' : 'Offer'}
            </button>
            <button @click=${() => logOut()} type="button" class="secondary">
              Logout
            </button>
          </div>
        </nav>
      </header>
    `;
  }
  return html`
    <header>
      <nav>
        <a href="/">
          <h1>Sharity</h1>
        </a>
        <div>
          <button @click=${() => navigate('search')} type="button">
            Search
          </button>
          <button @click=${showCreateAnnouncementModal} type="button">
            Add ${organizationKind === 'ong' ? 'Request' : 'Offer'}
          </button>
          <button @click=${() => logOut()} type="button" class="secondary">
            Logout
          </button>
        </div>
      </nav>
    </header>
  `;
};

export default navbar;
