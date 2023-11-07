/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, MONGO_CONNECTION = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(MONGO_CONNECTION);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '65474b50753172a62d27447f',
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
