const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { BCRYPT_WORK_FACTOR: BCRYPT_WORK_FACTOR_STRING } = process.env;

const BCRYPT_WORK_FACTOR = parseInt(BCRYPT_WORK_FACTOR_STRING, 10);

const userSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'The Organization needs to have a name'],
      trim: true,
    },
    logoAsBase64: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      lowercase: [true, 'The username needs to be lowercase'],
      required: [true, 'The username is required'],
      validate: {
        validator: (v) => /^[a-zA-Z0-9]*$/.test(v),
        message: (props) => `'${props.value}' is not a valid username`,
      },
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'You need a password to signup'],
    },
    kind: {
      type: String,
      enum: ['ong', 'company'],
      required: [
        true,
        'The organization needs to choose if it is an ONG or a Company',
      ],
    },
    category: {
      type: String,
      enum: ['fresh_food', 'nonperishable_food', 'others'],
      required: [
        true,
        'The organization needs to choose their prefered kind of donation',
      ],
    },
    address: {
      type: String,
      required: [
        true,
        'An addresss is required to allow for the delivery of donations ',
      ],
      trim: true,
    },
    phone: {
      type: String,
      validate: {
        validator: (v) => /^\d*$/.test(v),
        message: (props) => `${props.value} is not a valid phone number`,
      },
      required: [true, 'A phone number is required for contact purposes'],
      trim: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

async function hashPassword() {
  const user = this;
  if (!user.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(BCRYPT_WORK_FACTOR);
  user.password = await bcrypt.hash(user.password, salt);
}
userSchema.pre('save', hashPassword);

const User = mongoose.model('User', userSchema);
module.exports = User;
