const Blog = require('../models/Blog');
const formidable = require('formidable');
const { default: slugify } = require('slugify');
const stripHtml = require('string-strip-html');
const fs = require('fs');
const { smartTrim, fieldValidation } = require('../helpers/blogHelpers');

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
        return res.status(400).json({
          error: err
        });
      Blog.findByIdAndUpdate(
        blog._id,
        {
          $push: { categories: arrayOfCategories }
        },
        { new: true }
      ).exec((err, blog) => {
        if (err) {
          return res.status(400).json({
            error: err
          });
        } else {
          Blog.findByIdAndUpdate(
            blog._id,
            { $push: { tags: arrayOfTags } },
            { new: true }
          ).exec((err, blog) => {
            if (err) {
              return res.status(400).json({
                error: err
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

exports.listAllCategoriesTags = (req, res) => {};

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
        return res.json({
          error: err
        });

      return res.json(blogs);
    });
};

exports.read = (req, res) => {};

exports.update = (req, res) => {};

exports.remove = (req, res) => {};
