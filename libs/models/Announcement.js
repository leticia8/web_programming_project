const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A title for the announcement is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A description for the announcement is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['fresh_food', 'nonperishable_food', 'others'],
      lowercase: true,
      required: [true, 'The category of this donation needs to be specified'],
      trim: true,
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateUntil: { type: Date },
  },
  { timestamps: true },
);

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
