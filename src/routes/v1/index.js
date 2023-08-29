const express = require('express');
const auth = require('./auth.route');
const blog = require('./blog.route');
const user = require('./user.route');
const category = require('./category.route');
const tag = require('./tag.route');
const contact = require('./contact.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    handle: auth
  },
  {
    path: '/blog',
    handle: blog
  },
  {
    path: '/user',
    handle: user
  },
  {
    path: '/category',
    handle: category
  },
  {
    path: '/tag',
    handle: tag
  },
  {
    path: '/contact',
    handle: contact
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.handle);
});

module.exports = router;
