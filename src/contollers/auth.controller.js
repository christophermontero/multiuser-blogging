const _ = require('lodash');
const shortid = require('shortid');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const Blog = require('../models/Blog');
const { errorHandler } = require('../helpers/dbErrorHandler');
const {
  buildHtmlForResetPasswordEmail,
  buildHtmlForActivateAccountEmail
} = require('../templates/email');
const { sendEmailWithNodemailer } = require('../helpers/email');

require('dotenv').config();

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err || user) {
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
    res.cookie('token', token, { maxAge: 900000, httpOnly: true });
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

exports.secret = (req, res) => {
  res.json({
    user: req.auth
  });
};

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.auth._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.auth._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    if (user.role !== 1) {
      return res.status(400).json({
        error: 'Admin resource!. Access denied'
      });
    }
    req.profile = user;
    next();
  });
};

exports.canUpdateOrDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, blog) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    let isAuthorized =
      blog.postedBy._id.toString() === req.profile._id.toString();

    if (!isAuthorized) {
      return res.status(400).json({
        error: 'You are not authorized!'
      });
    }
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User with that email does not exits'
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: '10m'
    });

    const emailPayload = {
      from: process.env.EMAIL_VERIFIED,
      to: email,
      subject: 'Password reset link',
      html: buildHtmlForResetPasswordEmail(token)
    };

    return User.updateOne(
      {
        resetPasswordLink: token
      },
      (err, success) => {
        if (err) {
          return res.json({ error: errorHandler(err) });
        } else {
          const msg = `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 min`;
          return sendEmailWithNodemailer(req, res, emailPayload, msg);
        }
      }
    );
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: 'Expired link. Try again'
          });
        }

        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(401).json({
              error: 'Something went wrong. Try later'
            });
          }

          const updateFields = {
            password: newPassword,
            resetPasswordLink: ''
          };

          user = _.extend(user, updateFields);
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err)
              });
            }
            return res.json({
              message: 'Great! Now you can login with your new password'
            });
          });
        });
      }
    );
  }
};

exports.preSignup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken'
      });
    }
  });

  const token = jwt.sign(
    { name, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: '10m'
    }
  );

  const emailPayload = {
    from: process.env.EMAIL_VERIFIED,
    to: email,
    subject: 'Account activation link',
    html: buildHtmlForActivateAccountEmail(token)
  };

  const msg = `Email has been sent to ${email}. Follow the instructions to activate your account.`;
  return sendEmailWithNodemailer(req, res, emailPayload, msg);
};
