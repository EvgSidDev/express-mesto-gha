const User = require('../models/user');
const { ERROR_DATA, ValidationError, ERROR_NOT_FOUND } = require('../utils/errorCodes');
const { isURL } = require('../utils/util');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!isURL(avatar)) {
    res.status(ERROR_DATA).send({ message: 'Указанная ссылка на аватар не является ссылкой' });
    return;
  }
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.updateOne({ _id: req.user._id }, { name, about })
    .then((resultUpdate) => {
      if (resultUpdate.matchedCount === 0) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      req.params.userId = req.user._id;
      this.getUser(req, res);
    })
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!isURL(avatar)) {
    res.status(ERROR_DATA).send({ message: 'Указанная ссылка на аватар не является ссылкой' });
    return;
  }

  User.updateOne({ _id: req.user._id }, { avatar })
    .then((resultUpdate) => {
      if (resultUpdate.matchedCount === 0) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      req.params.userId = req.user._id;
      this.getUser(req, res);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
