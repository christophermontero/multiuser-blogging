const { sendEmailWithNodemailer } = require('../helpers/email');
const { buildHtmlForEmail } = require('../templates/email');

exports.sendEmail = (req, res) => {
  const { name, email, message } = req.body;

  const emailPayload = {
    from: email,
    to: process.env.EMAIL_VERIFIED,
    subject: 'Website Contact Form',
    text: `Email received from contact form \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: buildHtmlForEmail(email, name, message)
  };

  sendEmailWithNodemailer(req, res, emailPayload);
};

exports.sendEmailToAuthor = (req, res) => {
  const { name, email, authorEmail, message } = req.body;
  let mailist = [authorEmail, process.env.EMAIL_VERIFIED];
  const emailPayload = {
    to: mailist,
    from: { email },
    subject: `Someone messaged you from - ${process.env.APP_NAME}`,
    text: `Email received from  \n Email: ${process.env.EMAIL_VERIFIED} \n Message: ${message}`,
    html: buildHtmlForEmail(email, name, message)
  };

  sendEmailWithNodemailer(req, res, emailPayload);
};
