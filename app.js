/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { thisUser } = require('./middlewares/thisUser');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(thisUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
