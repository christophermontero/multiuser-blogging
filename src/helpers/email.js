const nodeMailer = require('nodemailer');

exports.sendEmailWithNodemailer = (req, res, emailData, msg = undefined) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_VERIFIED,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  return transporter
    .sendMail(emailData)
    .then((info) => {
      return res.json({
        ...(msg ? { message: msg } : { success: true })
      });
    })
    .catch((err) => console.log(`Problem sending email: ${err}`));
};
