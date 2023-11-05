/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, MONGO_CONNECTION = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(MONGO_CONNECTION);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '65452d8a74304e5400ba763f',
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
