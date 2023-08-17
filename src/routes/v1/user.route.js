const express = require('express');
const router = express.Router();
const {
  authController,
  userController,
  blogController
} = require('../../contollers');
const { requireSignin } = require('../../contollers/auth.controller');

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
router.post(
  '/blog',
  requireSignin,
  authController.authMiddleware,
  blogController.create
);
router.delete(
  '/blog/:slug',
  requireSignin,
  authController.authMiddleware,
  authController.canUpdateOrDeleteBlog,
  blogController.remove
);
router.put(
  '/blog/:slug',
  requireSignin,
  authController.authMiddleware,
  authController.canUpdateOrDeleteBlog,
  blogController.update
);

module.exports = router;
