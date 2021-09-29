import { navigationEventSubscription, navigate } from './utils/router.js';
import loginForm from './templates/loginForm.js';
import signupForm from './templates/signupForm.js';
import dashboardScreen from './templates/dashboardScreen.js';
import { removeAuthError } from './utils/sessions.js';
import searchOneAnnForm from './templates/searchOneAnnForm.js';
import searchAnnForm from './templates/searchAnnForm.js';
import resolvePromise from './directives/resolvePromise.js';

const routes = [
  {
    path: '/',
    auth: true,
    getTemplate: dashboardScreen,
  },
  {
    path: '/login',
    getTemplate: loginForm,
  },
  {
    path: '/signup',
    getTemplate: signupForm,
  },
  {
    path: '/search',
    auth: true,
    getTemplate: searchAnnForm,
  },
  {
    path: `/announcementInfo/:announcementId`,
    auth: true,
    getTemplate: (params) =>
      resolvePromise(searchOneAnnForm(params.announcementId)),
  },
];

removeAuthError();
window.addEventListener('navigation', navigationEventSubscription(routes));
window.addEventListener('popstate', navigationEventSubscription(routes));
// Figure out the path segments for the route which should load initially.
const pathnameSplit = window.location.pathname.split('/');
const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : '';
// Load the initial route.
navigate(...pathSegments);
