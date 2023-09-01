exports.buildHtmlForEmail = (email, name, message) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      h4 {
        color: #333;
      }

      p {
        color: #666;
      }

      hr {
        border: 1px solid #ddd;
        margin: 10px 0;
      }

      .footer {
        color: #999;
        text-align: center;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h4>Message received from:</h4>
      <p>Email: <strong>${email}</strong></p>
      <p>Name: ${name}</p>
      <p>Message:</p>
      <p>${message}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      <p>
        <a href="https://multiuserblogging.com"
          >https://multiuserblogging.com</a
        >
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} MultiUser Blogging
    </div>
  </body>
</html>
`;
