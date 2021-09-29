const Announcements = require('../../libs/models/Announcement');
const User = require('../../libs/models/User');

module.exports = async (event) => {
  const {
    organization,
    category,
    dateUntil,
    limit,
    in_user_category: inUserCategory,
  } = event.queryStringParameters;
  const searchInUserCategory = inUserCategory === '1';
  if (!!searchInUserCategory && (organization || category || dateUntil)) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('The filters used cannot be used in conjunction'),
    };
  }
  try {
    let orgId;
    let announcementCategory = category;
    if (organization || organization === '') {
      orgId = await User.find({
        companyName: { $regex: organization, $options: 'i' },
      }).select('_id');
    } else if (searchInUserCategory) {
      announcementCategory = event.auth.category;
    } else {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          'Either the organization param or in_user_category must be specified',
        ),
      };
    }
    let announcements = Announcements.find({
      $and: [
        announcementCategory && category !== ''
          ? { category: announcementCategory }
          : {},
        dateUntil && dateUntil !== '' ? { dateUntil } : {},
        orgId ? { organization: orgId } : {},
      ],
    })
      .find({ $or: [{ dateUntil: { $gte: new Date() } }, { dateUntil: null }] })
      .populate('organization', { pasword: 0, _id: 0 });
    if (limit) {
      announcements = announcements.limit(parseInt(limit, 10));
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(await announcements),
    };
  } catch (err) {
    return { statusCode: 500 };
  }
};
