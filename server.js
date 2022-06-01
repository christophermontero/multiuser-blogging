const express = require('express');
const morgan = requrie('morgan');
const bodyParser = requrie('body-parser');
const cookieParser = requrie('cookie-parser');
const cors = requrie('cors');

require('dotenv').config();

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
// CORS
app.use(cors());

// Routes
app.get('/api', (req, res) => {
  res.json({ time: Date.toString() });
});

// Port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
