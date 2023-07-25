const User = require('../models/User');
const Blog = require('../models/Blog');

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
