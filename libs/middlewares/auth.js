/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const Users = require('../models/User');

const httpUnauthorized = (body) => ({
  statusCode: 401,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

module.exports = (bypassedMethods = []) => {
  return {
    before: (handler, next) => {
      const { event } = handler;
      if (bypassedMethods.indexOf(event.httpMethod) >= 0) {
        return next();
      }
      const authHeader = event.headers.authorization;
      if (!authHeader) {
        return handler.callback(
          null,
          httpUnauthorized({
            error: 'missing_authorization_header',
          }),
        );
      }
      const [type, token] = authHeader.split(' ');
      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (type !== 'Bearer') {
        return handler.callback(
          null,
          httpUnauthorized({
            error: 'incorrect_authorization_type',
          }),
        );
      }
      try {
        const { sub: userId } = jwt.verify(token, secret);
        Users.findById(userId)
          .then((user) => {
            if (!user) {
              return handler.callback(
                null,
                httpUnauthorized({
                  error: 'invalid_token',
                }),
              );
            }
            event.auth = user;
            return next();
          })
          .catch(() => {
            return handler.callback(null, {
              statusCode: 500,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ error: 'internal_server_error' }),
            });
          });
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return handler.callback(
            null,
            httpUnauthorized({
              error: 'token_expired',
            }),
          );
        }
        return handler.callback(
          null,
          httpUnauthorized({
            error: 'invalid_token',
          }),
        );
      }
    },
  };
};
