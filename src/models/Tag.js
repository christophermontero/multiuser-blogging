const { mongoose } = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      required: true,
      maxLength: 32
    },
    slug: {
      type: String,
      unique: true,
      index: true
    }
  },
  { timestamp: true }
);

module.exports = mongoose.model('Tag', tagSchema);
