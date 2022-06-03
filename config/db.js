const mongoose = require('mongoose');

module.exports = () => {
  mongoose
    .connect(process.env.DATABASE)
    .then((conn) =>
      console.log(
        `MongoDB connected at: ${conn.connection._connectionString}`.cyan
          .underline.bold
      )
    )
    .catch(
      (err) => console.log('Connection error => ', err).red.underline.bold
    );
};
