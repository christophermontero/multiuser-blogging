const express = require('express');
const { contactController } = require('../../contollers');
const router = express.Router();
const { runValidation } = require('../../validators');
const { contactFormValidator } = require('../../validators/form.validator');

router.post(
  '/',
  contactFormValidator,
  runValidation,
  contactController.sendEmail
);
router.post(
  '/author',
  contactFormValidator,
  runValidation,
  contactController.sendEmailToAuthor
);
module.exports = router;
