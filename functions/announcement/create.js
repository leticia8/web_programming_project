const mongoose = require('mongoose');

const Announcements = require('../../libs/models/Announcement');

module.exports = async (event) => {
  const { body } = event;
  try {
    const user = event.auth;
    const { title, description, category, dateUntil } = JSON.parse(body);
    // eslint-disable-next-line no-underscore-dangle
    const organization = user._id;
    const newAnn = new Announcements({
      title,
      description,
      category,
      organization,
      dateUntil,
    });
    await newAnn.save();
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        Location: `${event.headers.origin}${event.path}/${newAnn.id}`,
      },
      body: JSON.stringify(newAnn),
    };
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: err.errors.title && err.errors.title.message,
          description: err.errors.description && err.errors.description.message,
          category: err.errors.category && err.errors.category.message,
          dateUntil: err.errors.dateUntil && err.errors.dateUntil.message,
        }),
      };
    }
    return { statusCode: 500 };
  }
};
