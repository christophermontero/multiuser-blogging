exports.smartTrim = (str, len, delim, appendix) => {
  if (str.length <= len) return str;
  let trimmedStr = str.substring(0, len + delim.length);
  const lastDelimIndex = trimmedStr.lastIndexOf(delim);
  if (lastDelimIndex >= 0) trimmedStr.substring(0, lastDelimIndex);
  if (trimmedStr) trimmedStr += appendix;
  return trimmedStr;
};

exports.fieldValidation = (title, body, categories, tags, files) => {
  let message = '';

  if (!title || !title.length) message = 'Title is required';
  else if (!body || body.length < 200) message = 'Content is too short';
  else if (!categories || categories.length === 0)
    message = 'At least one category is required';
  else if (!tags || tags.length === 0) message = 'At least one tag is required';
  else if (files.photo && files.photo.size > 10000000)
    message = 'Image should be less than 1Mb';
  else if (!files.photo) message = 'Featured image is required';

  return message;
};
