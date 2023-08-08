const express = require('express');
const router = express.Router();
const { authController, userController } = require('../../contollers');

router.get(
  '/profile',
  authController.requireSignin,
  authController.authMiddleware,
  userController.read
);
router.put(
  '/profile',
  authController.requireSignin,
  authController.authMiddleware,
  userController.updateUser
);
router.get('/photo/:username', userController.userProfilePicture);
router.get('/:username', userController.publicProfile);

module.exports = router;
