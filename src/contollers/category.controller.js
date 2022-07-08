const Category = require('../models/Category');
const { default: slugify } = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
  let category = new Category({ name, slug });
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    return res.json(data);
  });
};
