const middy = require('@middy/core');

const authMiddleware = require('../libs/middlewares/auth');
const dbMiddleware = require('../libs/middlewares/db');

const greetings = ['Hello', 'Hi', 'Howdy', 'Good vibes'];

const comeUpWithAGreeting = (name) => {
  const today = new Date();
  const curHr = today.getHours();

  if (curHr >= 0 && curHr < 6) {
    return `What are you doing this early, ${name}?`;
  }
  if (curHr >= 6 && curHr < 12) {
    return `Good Morning ${name}`;
  }
  if (curHr >= 12 && curHr < 17) {
    const selected = greetings[Math.floor(Math.random() * greetings.length)];
    return `${selected}, ${name}`;
  }
  return `Good night, ${name}`;
};

const handler = async (event) => {
  const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '');
  const segments = path.split('/').filter((e) => e);
  const method = event.httpMethod;

  if (method === 'GET' && segments.length === 0) {
    const {
      auth: { companyName: name },
    } = event;
    return {
      statusCode: 200,
      body: JSON.stringify(comeUpWithAGreeting(name)),
    };
  }
  return {
    statusCode: 501,
  };
};

exports.handler = middy(handler).use(dbMiddleware()).use(authMiddleware());
