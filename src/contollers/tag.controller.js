const Tag = require('../models/Tag');
const Blog = require('../models/Blog');
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
    return res.json(tags);
  });
};

exports.read = (req, res) => {
  const name = req.params.name;
  Tag.findOne({ name }).exec((err, tag) => {
    if (!tag) {
      return res.status(404).json({
        error: 'This tag was not found'
      });
    }
    Blog.find({ tags: tag })
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name')
      .select(
        '_id title slug excerpt categories postedBy tags createdAt updatedAt'
      )
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }
        return res.json({ tag, blogs: data });
      });
  });
};

exports.remove = (req, res) => {
  const name = req.params.name;
  Tag.findOneAndRemove({ name }).exec((err, tag) => {
    if (!tag) {
      return res.status(404).json({
        error: 'This tag was not found'
      });
    }
    return res.json({ message: 'Tag has been deleted!' });
  });
};
