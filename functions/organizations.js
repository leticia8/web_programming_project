const middy = require('@middy/core');

const organizations = require('./organization');
const dbMiddleware = require('../libs/middlewares/db');
const authMiddleware = require('../libs/middlewares/auth');

const handler = async (event, context) => {
  const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '');
  const segments = path.split('/').filter((e) => e);

  switch (event.httpMethod) {
    case 'GET':
      /* GET /.netlify/functions/organizations */
      if (segments.length === 0) {
        return organizations.readAll(event, context);
      }
      /* GET /.netlify/functions/organizations/123456 */
      if (segments.length === 1) {
        const [id] = segments;
        return organizations.read({ ...event, id }, context);
      }
      return {
        statusCode: 400,
        body: 'too many segments in GET request',
      };
    /* POST /.netlify/functions/organizations */
    case 'POST':
      return organizations.create(event, context);
    /* PUT /.netlify/functions/organizations/123456 */
    case 'PUT':
      if (segments.length === 1) {
        const [id] = segments;
        return organizations.update({ ...event, id }, context);
      }
      return {
        statusCode: 400,
        body:
          'invalid segments in POST request, must be /.netlify/functions/organizations/123456',
      };
    /* DELETE /.netlify/functions/organizations/123456 */
    case 'DELETE':
      if (segments.length === 1) {
        const [id] = segments;
        return organizations.delete({ ...event, id }, context);
      }
      return {
        statusCode: 400,
        body:
          'invalid segments in DELETE request, must be /.netlify/functions/organizations/123456',
      };

    /* Fallthrough case */
    default:
      return {
        statusCode: 405,
        body: 'unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE',
      };
  }
};

exports.handler = middy(handler)
  .use(dbMiddleware())
  .use(authMiddleware(['POST']));
