const express = require('express');
const router = express.Router();
const { authController, userController } = require('../../contollers');

router.get(
  '/profile',
  authController.requireSignin,
  authController.authMiddleware,
  userController.read
);

module.exports = router;
