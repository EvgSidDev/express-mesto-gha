/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { PORT = 3000, MONGO_CONNECTION = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(MONGO_CONNECTION);
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('', require('./routes/index'));
app.use(require('./middlewares/error'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
