const express = require('express');
const router = express.Router();
const { authController } = require('../../contollers');
const { runValidation } = require('../../validators');
const {
  userSignupValidator,
  userSinginValidator
} = require('../../validators/auth');

router.post(
  '/signup',
  userSignupValidator,
  runValidation,
  authController.signup
);
router.post(
  '/signin',
  userSinginValidator,
  runValidation,
  authController.signin
);
router.get('/signout', authController.requireSignin, authController.signout);
//router.get('/secret', authController.requireSignin, authController.secret);

module.exports = router;
