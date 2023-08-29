const mailProvider = require('@sendgrid/mail');
mailProvider.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = (req, res) => {
  const { name, email, message } = req.body;
  const emailPayload = {
    to: email,
    from: { email: process.env.SENDER },
    subject: `Contact form - ${process.env.APP_NAME}`,
    text: `Email received from contract form \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
    <h4>Email received from contact form:</h4>
    <p>Sender name: ${name}</p>
    <p>Sender email: ${email}</p>
    <p>Sender message: ${email}</p>
    <hr />
    <p>This email may contain sensitive information</p>
    <p>https://multiuserblog.com</p>
    `
  };

  mailProvider.send(emailPayload).then((sent) => {
    return res.json({
      success: true
    });
  });
};
