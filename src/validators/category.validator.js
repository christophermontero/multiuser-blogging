const { check } = require('express-validator');

exports.createCategoryValidator = [
  check('name').not().isEmpty().withMessage('Name is required')
];
