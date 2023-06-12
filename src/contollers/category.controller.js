const Category = require('../models/Category');
const Blog = require('../models/Blog');
const { default: slugify } = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  const { name } = req.body;
  const slug = slugify(name).toLowerCase();
  let category = new Category({ name, slug });
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    return res.json(category);
  });
};

exports.list = (req, res) => {
  Category.find({}).exec((err, categories) => {
    return res.json(categories);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Category.findOne({ slug }).exec((err, category) => {
    if (!category) {
      return res.status(404).json({
        error: 'This category was not found'
      });
    }
    Blog.find({ categories: category })
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
        return res.json({ category, blogs: data });
      });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Category.findOneAndRemove({ slug }).exec((err, category) => {
    if (!category) {
      return res.status(404).json({
        error: 'This category was not found'
      });
    }
    return res.json({ message: 'Category has been deleted!' });
  });
};
