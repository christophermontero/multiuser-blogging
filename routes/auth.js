const express = require('express');
const { signup, signin } = require('../contollers/auth');
const router = express.Router();

// validators
const { runValidation } = require('../validators');
const {
  userSignupValidator,
  userSinginValidator
} = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSinginValidator, runValidation, signin);

module.exports = router;
