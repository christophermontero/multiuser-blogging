const Blog = require('../models/Blog');
const formidable = require('formidable');
const { default: slugify } = require('slugify');
const stripHtml = require('string-strip-html');
const fs = require('fs');
const { smartTrim, fieldValidation } = require('../helpers/blogHelpers');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err)
      return res.status(400).json({
        error: 'Image could not upload'
      });
    const { title, body, categories, tags } = fields;
    const fieldValidationMsg = fieldValidation(
      title,
      body,
      categories,
      tags,
      files
    );

    if (fieldValidationMsg) {
      return res.status(400).json({
        error: fieldValidationMsg
      });
    }

    const photoData = fs.readFileSync(files.photo.filepath);
    const photoContentType = files.photo.mimetype;
    const excerptBlog = smartTrim(body, 320, ' ', '...');
    let arrayOfCategories = categories && categories.split(',');
    let arrayOfTags = tags && tags.split(',');

    const blog = new Blog({
      title,
      body,
      excerpt: excerptBlog,
      slug: slugify(title).toLowerCase(),
      metaTitle: `${title} | ${process.env.APP_NAME}`,
      metaDesc: stripHtml(body.substring(0, 160)),
      postedBy: req.profile._id,
      photo: { binData: photoData, contentType: photoContentType }
    });

    blog.save((err, blog) => {
      if (err)
        return res.status(500).json({
          error: errorHandler(err)
        });

      Blog.findByIdAndUpdate(
        blog._id,
        {
          $push: { categories: arrayOfCategories }
        },
        { new: true }
      ).exec((err, blog) => {
        if (err) {
          return res.status(500).json({
            error: errorHandler(err)
          });
        } else {
          Blog.findByIdAndUpdate(
            blog._id,
            { $push: { tags: arrayOfTags } },
            { new: true }
          ).exec((err, blog) => {
            if (err) {
              return res.status(500).json({
                error: errorHandler(err)
              });
            } else {
              return res.json(blog);
            }
          });
        }
      });
    });
  });
};

exports.listAllCategoriesTags = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10,
    skip = req.body.skip ? parseInt(req.body.skip) : 0,
    blogs,
    categories,
    tags;

  // Get all blogs
  Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      '_id title slug excerpt categories tags postedBy createdAt updatedAt'
    )
    .exec((err, b) => {
      if (err)
        return res.status(500).json({
          error: errorHandler(err)
        });

      blogs = b;

      // Get the total count of blogs
      Blog.countDocuments().exec((err, count) => {
        if (err)
          return res.status(500).json({
            error: errorHandler(err)
          });

        // Get all categories
        Category.find({}).exec((err, c) => {
          if (err)
            return res.status(500).json({
              error: errorHandler(err)
            });

          categories = c;

          // Get all tags
          Tag.find({}).exec((err, t) => {
            if (err)
              return res.status(500).json({
                error: errorHandler(err)
              });

            tags = t;

            // Return all categories, tags, blogs, and the total count of blogs
            return res.json({ blogs, categories, tags, size: count });
          });
        });
      });
    });
};

exports.list = (req, res) => {
  Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name')
    .populate('postedBy', '_id name username')
    .select(
      '_id title slug excerpt categories tags postedBy createdAt updatedAt'
    )
    .exec((err, blogs) => {
      if (err)
        return res.status(500).json({
          error: errorHandler(err)
        });

      return res.json(blogs);
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug })
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .select(
      '_id title body slug metaTitle metaDesc categories tags postedBy createdAt updatedAt'
    )
    .exec((err, blog) => {
      if (err)
        return res.status(500).json({
          error: errorHandler(err)
        });

      if (!blog) {
        return res.status(404).json({
          error: 'Blog not found'
        });
      }

      return res.json(blog);
    });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, oldBlog) => {
    if (err)
      return res.status(500).json({
        error: errorHandler(err)
      });

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err)
        return res.status(400).json({
          error: 'Image could not upload'
        });

      let slugBeforeMerge = oldBlog.slug;

      oldBlog = _.merge(oldBlog, fields);
      oldBlog.slug = slugBeforeMerge;

      const { body, categories, tags } = fields;

      if (body) {
        oldBlog.excerpt = smartTrim(body, 320, ' ', '...');
        oldBlog.metaDesc = stripHtml(body.substring(0, 160));
      }

      if (categories) {
        oldBlog.categories = categories.split(',');
      }

      if (tags) {
        oldBlog.tags = tags.split(',');
      }

      if (files.photo && files.photo.size > 10000000) {
        return res.status(400).json({
          error: 'Image should be less than 1Mb'
        });
      }

      oldBlog.photo = {
        binData: fs.readFileSync(files.photo.filepath),
        contentType: files.photo.mimetype
      };

      oldBlog.save((err, blog) => {
        if (err)
          return res.status(500).json({
            error: errorHandler(err)
          });
        return res.json(blog);
      });
    });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOneAndRemove({ slug }).exec((err, blog) => {
    if (err)
      return res.status(500).json({
        error: errorHandler(err)
      });

    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    return res.json({
      message: 'Blog deleted successfully'
    });
  });
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug })
    .select('photo')
    .exec((err, blog) => {
      if (err) {
        return res.status(500).json({
          error: errorHandler(err)
        });
      }

      if (!blog) {
        return res.status(404).json({
          error: 'Blog not found'
        });
      }

      res.set('Content-Type', blog.photo.contentType);
      return res.send(blog.photo.binData);
    });
};

exports.listRelated = (req, res) => {
  const limit = req.body.limit ? parseInt(req.body.limit) : 3;

  const { _id, categories } = req.body.blog;

  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate('postedBy', '_id name profile')
    .select('title slug excerpt postedBy createdAt updatedAt')
    .exec((err, blogs) => {
      if (err) {
        return res.status(404).json({
          error: 'Blogs not found'
        });
      }

      return res.json(blogs);
    });
};

exports.listSearch = (req, res) => {
  const { search } = req.query;
  if (search) {
    Blog.find(
      {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { body: { $regex: search, $options: 'i' } }
        ]
      },
      (err, blogs) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }

        return res.json(blogs);
      }
    ).select('-photo -body');
  } else {
    return res.json([]);
  }
};
