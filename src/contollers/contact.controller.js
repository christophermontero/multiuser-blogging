const { sendEmailWithNodemailer } = require('../helpers/email');

exports.sendEmail = (req, res) => {
  const { name, email, message } = req.body;

  const emailPayload = {
    from: email,
    to: process.env.EMAIL_VERIFIED,
    subject: 'Website Contact Form',
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
        <h4>Email received from contact form:</h4>
        <p>Sender name: ${name}</p>
        <p>Sender email: ${email}</p>
        <p>Sender message: ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://multiuserblogging.com</p>
    `
  };

  sendEmailWithNodemailer(req, res, emailPayload);
};

exports.sendEmailToAuthor = (req, res) => {
  const { email, authorEmail, message } = req.body;
  let mailist = [authorEmail, process.env.SENDER];
  const emailPayload = {
    to: mailist,
    from: { email: process.env.SENDER },
    subject: `Someone messaged you from - ${process.env.APP_NAME}`,
    text: `Email received from contract form \n Email: ${email} \n Message: ${message}`,
    html: `
    <h4>Message received from:</h4>
    <p>Email: ${email}</p>
    <p>Message: ${message}</p>
    <hr />
    <p>This email may contain sensitive information</p>
    <p>https://multiuserblogging.com</p>
    `
  };

  sendEmailWithNodemailer(req, res, emailPayload);
};
