const Category = require('../models/Category');
const { default: slugify } = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
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
    if (err) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    return res.json(categories);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Category.findOne({ slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    return res.json(category);
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Category.findOneAndRemove({ slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    return res.json({ message: 'Category has been deleted!' });
  });
};
