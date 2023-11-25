// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const user = require('./user');

const cardShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    /* eslint-disable */
    match: [/https?:\/\/[a-z1-9\-\.\/\_\~\:\\\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*/gm, 'Неправильный формат ссылки на изображение'],
    /* eslint-enable */
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
    required: true,
  },
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardShema);
