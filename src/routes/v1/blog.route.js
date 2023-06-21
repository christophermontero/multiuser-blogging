const express = require('express');
const { authController, blogController } = require('../../contollers');
const router = express.Router();

router.post('/categories-tags', blogController.listAllCategoriesTags);
router.post(
  '/',
  authController.requireSignin,
  authController.adminMiddleware,
  blogController.create
);
router.get('/', blogController.list);
router.get('/:slug', blogController.read);
router.get('/photo/:slug', blogController.photo);
router.put(
  '/:slug',
  authController.requireSignin,
  authController.adminMiddleware,
  blogController.update
);
router.get('/search', blogController.listSearch);
router.delete(
  '/:slug',
  authController.requireSignin,
  authController.adminMiddleware,
  blogController.remove
);
router.post('/related', blogController.listRelated);

module.exports = router;
