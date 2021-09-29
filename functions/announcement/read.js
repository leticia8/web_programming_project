const Announcements = require('../../libs/models/Announcement');

module.exports = async ({ id }) => {
  try {
    const announcements = await Announcements.findById(
      id,
    ).populate('organization', { password: 0 });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(announcements),
    };
  } catch (err) {
    // eslint-disable-next-line spaced-comment
    //console.log(err);
    return { statusCode: 404 };
  }
};
