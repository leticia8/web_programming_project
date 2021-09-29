const mongoose = require('mongoose');

const {
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_CONNECTION_STRING,
} = process.env;

const CONNECTION_OPTIONS = {
  auth: { user: MONGO_DB_USER, password: MONGO_DB_PASSWORD },
  useNewUrlParser: true,
  bufferCommands: false,
  bufferMaxEntries: 0,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

let cachedConnection = null;

const db = () => ({
  before: (handler, next) => {
    // Allow AWS Lambda to reuse cached DB connection between function invocations.
    handler.context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line no-param-reassign

    if (cachedConnection === null) {
      mongoose
        .connect(MONGO_DB_CONNECTION_STRING, CONNECTION_OPTIONS)
        .then((connection) => {
          cachedConnection = connection;
          next();
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
      return;
    }

    next();
  },
});

module.exports = db;
