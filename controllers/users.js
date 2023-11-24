const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {
  ERROR_DATA,
  ValidationError,
  ERROR_NOT_FOUND,
  CastError,
  OK,
  OK_CREATE,
  SERVER_ERROR,
} = require('../utils/httpConstants');
require('dotenv').config();
const ServerError = require('../errors/ServerError');
const DataError = require('../errors/DataError');
const NotFoundError = require('../errors/NotFound');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotUniqueError = require('../errors/NotUniqueError');

const {
  JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b',
} = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .status(OK)
        .send({
          jwt: token,
        });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.error(err.message);
      next(new ServerError(message));
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
        .then((user) => {
          res.status(OK_CREATE).send({ name, about, avatar, email });
        })
        .catch((err) => {
          if (err.name === ValidationError) {
            next(new DataError(err.message));
          } else if (err.code === 11000) {
            next(new NotUniqueError('Указанная почта уже используется'));
          } else {
            console.error(err.message);
            next(new ServerError(message));
          }
        });
    })
    .catch((err) => {
      console.error(err.message);
      next(new ServerError(message));
    });
};

module.exports.getUser = (req, res, next) => {
  let idUser = req.user;
  if (req.params.userId) {
    idUser = req.params.userId;
  }
  User.findById(idUser)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.codeStatus) {
        next(err);
        return;
      }
      if (err.name === CastError) {
        next(new DataError('Передан невалидный id'));
        return;
      } else {
        console.error(err.message);
        next(new ServerError(message));
        return;
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, about },
    { new: true, runValidators: true },
  )
    .then((resultUpdate) => {
      if (resultUpdate === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(OK).send(resultUpdate);
    })
    .catch((err) => {
      if (err.name === ValidationError) {
        next(new DataError({ message: err.message }));
      } else {
        console.error(err.message);
        next(new ServerError(message));
        return;
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar },
    { new: true, runValidators: true },
  )
    .then((resultUpdate) => {
      if (resultUpdate === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(OK).send(resultUpdate);
    })
    .catch((err) => {
      if (err.name === ValidationError) {
        next(new DataError(err.message));
      } else {
        console.error(err.message);
        next(new ServerError(message));
      }
    });
};
