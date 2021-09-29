const jwt = require('jsonwebtoken');

module.exports = (user) => {
  const userId = user.id;
  const payload = { sub: userId };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });
  return accessToken;
};
