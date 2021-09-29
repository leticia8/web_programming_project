const mongoose = require('mongoose');
const User = require('../../libs/models/User');

module.exports = async (event) => {
  const { body } = event;
  try {
    const {
      username,
      password,
      kind,
      category,
      address,
      phone,
      companyName,
      logo: logoAsBase64,
    } = JSON.parse(body);
    const newUser = new User({
      username,
      password,
      kind,
      category,
      address,
      phone,
      companyName,
      logoAsBase64,
    });
    await newUser.save();
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        Location: `${event.headers.origin}${event.path}/${newUser.id}`,
      },
      body: JSON.stringify({
        result: 'ok',
      }),
    };
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: err.errors.username && err.errors.username.message,
          password: err.errors.password && err.errors.password.message,
          kind: err.errors.kind && err.errors.kind.message,
          category: err.errors.category && err.errors.category.message,
          address: err.errors.address && err.errors.address.message,
          phone: err.errors.phone && err.errors.phone.message,
          companyName: err.errors.companyName && err.errors.companyName.message,
        }),
      };
    }
    if (err.code === 11000) {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'An orgnanization with this username already exists',
        }),
      };
    }
    return {
      statusCode: 500,
    };
  }
};
