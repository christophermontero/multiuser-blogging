const { mongoose } = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
      unique: true,
      index: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    profile: {
      type: String,
      required: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    salt: {
      type: String
    },
    about: {
      type: String
    },
    role: {
      type: Number,
      required: true
    },
    photo: {
      binData: Buffer
    },
    resetPasswordLink: {
      type: String,
      default: ''
    }
  },
  { timestamp: true }
);

module.exports = mongoose.model('User', userSchema);
