const User = require('../models/user');
const { ERROR_DATA, ValidationError, ERROR_NOT_FOUND, CastError, OK, OK_CREATE, SERVER_ERROR } = require('../utils/httpConstants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.error(err.message);
      res.status(SERVER_ERROR).send();
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
        res.status(SERVER_ERROR).send();
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
      if(err.name === CastError) {
        res.status(ERROR_NOT_FOUND).send({message: err.message});
      } else {
      console.error(err.message);
      res.status(SERVER_ERROR).send();
      }
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
      res.status(OK).send(resultUpdate);
    })
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        console.error(err.message);
        res.status(SERVER_ERROR).send();
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
      res.status(OK).send(resultUpdate);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(SERVER_ERROR).send();
    });
};
