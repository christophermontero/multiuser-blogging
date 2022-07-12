const { check } = require('express-validator');

exports.createBlogValidator = [
  check('title').notEmpty().withMessage('Title is required'),
  check('body')
    .notEmpty()
    .isLength({ min: 200, max: 2000000 })
    .withMessage('Body is too short'),
  check('categories')
    .isArray({ min: 0 })
    .withMessage('At least one category is required'),
  check('tags').isArray({ min: 0 }).withMessage('At least one tag is required')
];
