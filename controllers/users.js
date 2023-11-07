const User = require('../models/user');
const { ERROR_DATA, ValidationError, ERROR_NOT_FOUND } = require('../utils/errorCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err.message);
      res.status(500);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        console.error(err.message);
        res.status(500);
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
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500);
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .then((resultUpdate) => {
      if (resultUpdate.matchedCount === 0) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(200).send(resultUpdate);
    })
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        console.error(err.message);
        res.status(500);
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .then((resultUpdate) => {
      if (resultUpdate.matchedCount === 0) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(200).send(resultUpdate);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500);
    });
};
