const express = require('express');
const router = express.Router();
const { time } = require('../contollers/blog');

router.get('/', time);

module.exports = router;
