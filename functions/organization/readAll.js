const User = require('../../libs/models/User');

module.exports = async (event) => {
  let {
    // eslint-disable-next-line prefer-const
    companyName,
    category,
    kind,
    // eslint-disable-next-line prefer-const
    limit,
    // eslint-disable-next-line prefer-const
    in_user_category: inUserCategory,
  } = event.queryStringParameters;
  const searchInUserCategory = inUserCategory === '1';
  if (!!searchInUserCategory && (companyName || category || kind)) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('The filters used cannot be used in conjunction'),
    };
  }
  if (searchInUserCategory) {
    kind = event.auth.kind === 'ong' ? 'company' : 'ong';
    // eslint-disable-next-line prefer-destructuring
    category = event.auth.category;
  }
  try {
    let users = User.find({
      $and: [
        category !== '' ? { category } : {},
        kind !== '' ? { kind } : {},
        companyName !== '' ? { organization: companyName } : {},
      ],
    }).select('-password');
    if (limit) {
      users = users.limit(parseInt(limit, 10));
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(await users),
    };
  } catch (err) {
    return { statusCode: 500 };
  }
};
