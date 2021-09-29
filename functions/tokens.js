const middy = require('@middy/core');

const Users = require('../libs/models/User');
const dbMiddleware = require('../libs/middlewares/db');
const tokenProvider = require('../libs/tokenProvider');

const handler = async function server(event) {
  const method = event.httpMethod;
  if (method === 'POST') {
    const { username, password } = JSON.parse(event.body);
    const user = await Users.findOne({ username }).exec();
    if (!user || !(await user.comparePassword(password))) {
      return {
        statusCode: 401,
      };
    }
    const accessToken = tokenProvider(user);
    return {
      statusCode: 200,
      body: JSON.stringify({
        token: accessToken,
        kind: user.kind,
        logo: user.logoAsBase64,
      }),
    };
  }
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'unsupported_method' }),
  };
};

exports.handler = middy(handler).use(dbMiddleware());
