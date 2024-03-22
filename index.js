const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const rentalRoutes = require('./routes/rental.routes.js');
app.use('/api', rentalRoutes);

const errorMiddleware = require('./middleware/error.js');
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
