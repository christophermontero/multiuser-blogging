const express = require('express');
const router = express.Router();
const { requireSignin } = require('../../contollers/auth.controller');
const { authController, categoryController } = require('../../contollers');
const { runValidation } = require('../../validators');
const { categoryCreateValidator } = require('../../validators/category');

router.post(
  '/create',
  categoryCreateValidator,
  runValidation,
  requireSignin,
  authController.adminMiddleware,
  categoryController.create
);

module.exports = router;
