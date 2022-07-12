const Blog = require('../models/Blog');
const formidable = require('formidable');
const { default: slugify } = require('slugify');
const stripHtml = require('string-strip-html');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err)
      return res.status(400).json({
        error: 'Image could not upload'
      });
    const { title, body, categories, tags } = fields;
    if (!title || !title.length)
      return res.status(400).json({
        error: 'Title is required'
      });
    //if (!body || body.length < 200)
    //return res.status(400).json({
    //error: 'Body is too short'
    //});
    if (!categories || categories.length === 0)
      return res.status(400).json({
        error: 'At least one category is required'
      });
    if (!tags || tags.length === 0)
      return res.status(400).json({
        error: 'At least one tag is required'
      });
    const photoData = fs.readFileSync(files.photo.filepath);
    const photoContentType = files.photo.mimetype;
    let arrayOfCategories = categories && categories.split(',');
    let arrayOfTags = tags && tags.split(',');
    if (files.photo && files.photo.size > 10000000)
      return res.status(400).json({
        error: 'Image should be less than 1Mb'
      });
    const blog = new Blog({
      title,
      body,
      slug: slugify(title).toLowerCase(),
      metaTitle: `${title} | ${process.env.APP_NAME}`,
      metaDesc: stripHtml(body.substring(0, 160)),
      postedBy: req.profile._id,
      photo: { binData: photoData, contentType: photoContentType }
    });
    blog.save((err, blog) => {
      if (err)
        return res.status(400).json({
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
          return res.status(400).json({
            error: errorHandler(err)
          });
        } else {
          Blog.findByIdAndUpdate(
            blog._id,
            { $push: { tags: arrayOfTags } },
            { new: true }
          ).exec((err, blog) => {
            if (err) {
              return res.status(400).json({
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
