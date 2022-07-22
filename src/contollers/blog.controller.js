const Blog = require('../models/Blog');
const formidable = require('formidable');
const { default: slugify } = require('slugify');
const stripHtml = require('string-strip-html');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { smartTrim, fieldValidation } = require('../helpers/blogHelpers');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    console.log('Error', err);
    if (err)
      return res.status(400).json({
        error: 'Image could not upload'
      });
    console.log('Fields', fields);
    const { title, body, categories, tags } = fields;
    const fieldValidationMsg = fieldValidation(
      title,
      body,
      categories,
      tags,
      files
    );

    if (fieldValidationMsg) {
      console.log('Field validation', fieldValidationMsg);
      return res.status(400).json({
        error: fieldValidationMsg
      });
    }

    const photoData = fs.readFileSync(files.photo.path);
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
