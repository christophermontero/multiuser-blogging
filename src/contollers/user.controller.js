const User = require('../models/User');
const Blog = require('../models/Blog');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.read = (req, res) => {
  req.profile.hashedPassword = undefined;
  return res.json({
    user: req.profile
  });
};

exports.publicProfile = (req, res) => {
  const username = req.params.username;
  console.log('username', username);
  User.findOne({
    username
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    Blog.find({
      postedBy: user._id
    })
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name')
      .limit(10)
      .select(
        '_id title slug excerpt categories tags postedBy createdAt updatedAt'
      )
      .exec((err, blogs) => {
        if (err) {
          return res.status(404).json({
            error: errorHandler(err)
          });
        }
        user.photo = undefined;
        user.hashedPassword = undefined;
        user.salt = undefined;
        res.json({
          user,
          blogs
        });
      });
  });
};

exports.updateUser = (req, res) => {
  let formData = new formidable.IncomingForm();
  formData.keepExtensions = true;
  formData.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded'
      });
    }
    let user = req.profile;
    console.log('before merge: ');
    user = _.extend(user, fields);

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size'
        });
      }
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      const { hashedPassword, salt, photo, ...safeUser } = result._doc;

      return res.json(safeUser);
    });
  });
};

exports.userProfilePicture = (req, res) => {
  const username = req.params.username;
  User.findOne({
    username
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.photo.data) {
      res.set('Content-Type', user.photo.contentType);
      return res.send(user.photo.data);
    }
  });
};
