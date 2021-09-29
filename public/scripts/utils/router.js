import { render } from 'https://unpkg.com/lit-html?module';

import { isAuthenticated } from './auth.js';
import { setAuthError } from './sessions.js';

export const navigate = (...urlSegments) => {
  // Push a history entry with the new url.
  const url = `/${urlSegments.join('/')}`;
  window.history.pushState({ urlSegments }, '', url);
  window.dispatchEvent(new CustomEvent('navigation', { detail: urlSegments }));
};

const matchUrlToRoute = (routes, urlSegments) => {
  const routeParams = {};
  const matchedRoute = routes.find((route) => {
    const routePathSegments = route.path.split('/').slice(1);

    if (routePathSegments.length !== urlSegments.length) {
      return false;
    }

    // A url will match if every non-parametric segment matches
    const match = routePathSegments.every((routePathSegment, i) => {
      return routePathSegment === urlSegments[i] || routePathSegment[0] === ':';
    });

    // If there is a match then we'll get any param from the URL.
    if (match) {
      routePathSegments.forEach((segment, i) => {
        if (segment[0] === ':') {
          const propName = segment.slice(1);
          routeParams[propName] = decodeURIComponent(urlSegments[i]);
        }
      });
    }
    return match;
  });
  if (matchedRoute) {
    return { ...matchedRoute, params: routeParams };
  }
  return null;
};

export const navigationEventSubscription = (routes) => (arg) => {
  let urlSegments;
  if (arg.type === 'popstate') {
    // eslint-disable-next-line prefer-destructuring
    urlSegments = arg.state.urlSegments;
  } else {
    urlSegments = arg.detail;
  }
  // Get the template for the given route.
  const matchedRoute = matchUrlToRoute(routes, urlSegments);
  if (!matchedRoute) {
    // TODO: Redirect the user to a "Not Found" page
    // eslint-disable-next-line no-console
    console.error(
      `The path ${urlSegments} does not match to any defined route`,
    );
    return;
  }
  if (matchedRoute.auth && !isAuthenticated()) {
    setAuthError('Ooops, sorry! Please login first');
    navigate('login');
    return;
  }
  const htmlResult = matchedRoute.getTemplate({ ...matchedRoute.params });
  if (htmlResult) {
    render(htmlResult, document.body);
  }
};
