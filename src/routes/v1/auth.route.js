const express = require('express');
const router = express.Router();
const { authController } = require('../../contollers');
const { runValidation } = require('../../validators');
const {
  userSignupValidator,
  userSinginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} = require('../../validators/auth.validator');

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
router.put(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  authController.forgotPassword
);
router.put(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  authController.resetPassword
);

module.exports = router;
