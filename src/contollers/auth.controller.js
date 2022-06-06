const shortid = require('shortid');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');

require('dotenv').config();

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ error: 'This email is already taken' });
    }
    const { name, email, password } = req.body;
    let username = shortid.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;
    let newUser = new User({
      name,
      email,
      password,
      profile,
      username
    });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json({
        message: 'Signup success'
      });
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup!'
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'The email and password do not match'
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    res.cookie('token', token, { maxAge: 60000 });
    const { _id, username, name, email, role } = user;
    return res.json({
      token,
      user: { _id, username, name, email, role }
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'Signout success!'
  });
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
});
