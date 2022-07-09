const express = require('express');
const router = express.Router();
const { requireSignin } = require('../../contollers/auth.controller');
const { authController, tagController } = require('../../contollers');
const { runValidation } = require('../../validators');
const { tagCreateValidator } = require('../../validators/tag.validator');

router.post(
  '/create',
  tagCreateValidator,
  runValidation,
  requireSignin,
  authController.adminMiddleware,
  tagController.create
);
router.get('/', tagController.list);
router.delete(
  '/:tag',
  requireSignin,
  authController.adminMiddleware,
  tagController.remove
);
module.exports = router;