'use strict';

/*
 * Get unique error field name
 */
const uniqueMessage = (error) => {
  let output;
  try {
    let fieldname = error.message.substring(
      error.message.lastIndexOf('E') + 1,
      error.message.lastIndexOf('_1')
    );
    output =
      fieldname.charAt(0).toUpperCase() +
      fieldname.slice(1) +
      ' already exists';
  } catch {
    output = 'Unique field already exists';
  }
  return output;
};

/*
 * Get the error message from error object
 */
exports.errorHandler = (error) => {
  let message = '';
  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message: 'Something went wrong';
    }
  } else {
    for (let errorName in error.errors) {
      if (error.errors[errorName].message)
        message = error.errors[errorName].message;
    }
  }
  return message;
};
