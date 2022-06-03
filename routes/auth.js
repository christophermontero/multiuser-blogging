const express = require('express');
const { signup } = require('../contollers/auth');
const router = express.Router();

// validators
const { runValidation } = require('../validators');
const { userSignupValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);

module.exports = router;
