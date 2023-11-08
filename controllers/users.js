const User = require('../models/user');
const {
  ERROR_DATA,
  ValidationError,
  ERROR_NOT_FOUND,
  CastError,
  OK,
  OK_CREATE,
  SERVER_ERROR,
} = require('../utils/httpConstants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.error(err.message);
      res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(OK_CREATE).send(user))
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        console.error(err.message);
        res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === CastError) {
        res.status(ERROR_DATA).send({ message: 'Передан не валидный id' });
      } else {
        console.error(err.message);
        res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .then((resultUpdate) => {
      if (resultUpdate === null) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(OK).send(resultUpdate);
    })
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        console.error(err.message);
        res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .then((resultUpdate) => {
      if (resultUpdate === null) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(OK).send(resultUpdate);
    })
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        console.error(err.message);
        res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};
