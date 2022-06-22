const express = require('express');
const auth = require('./auth.route');
const blog = require('./blog.route');
const user = require('./user.route');
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
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.handle);
});

module.exports = router;
