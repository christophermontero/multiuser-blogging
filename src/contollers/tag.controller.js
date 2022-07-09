const Tag = require('../models/Tag');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  const { name } = req.body;
  let tag = new Tag({ name });
  tag.save((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    return res.json(tag);
  });
};

exports.list = (req, res) => {
  Tag.find({}).exec((err, tags) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    return res.json(tags);
  });
};

exports.read = (req, res) => {
  const name = req.params.name.toLowerCase();
  Tag.findOne({ name }).exec((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    return res.json(tag);
  });
};

exports.remove = (req, res) => {
  const name = req.params.name.toLowerCase();
  Tag.findOneAndRemove({ name }).exec((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    return res.json({ message: 'Tag has been deleted!' });
  });
};
