const express = require('express');
const { authController, blogController } = require('../../contollers');
const router = express.Router();

router.post(
  '/',
  authController.requireSignin,
  authController.adminMiddleware,
  blogController.create
);

module.exports = router;
