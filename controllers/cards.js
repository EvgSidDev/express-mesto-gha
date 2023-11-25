const Card = require('../models/card');
const {
  ValidationError,
  CastError,
  OK,
  OK_CREATE,
} = require('../utils/httpConstants');
const ServerError = require('../errors/ServerError');
const DataError = require('../errors/DataError');
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch((err) => next(new ServerError(err.message)));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(OK_CREATE).send(card))
    .catch((err) => {
      if (err.name === ValidationError) {
        next(new DataError(err.message));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const _id = req.params.cardId;
  Card.findById({ _id })
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалать чужие карточки');
      }
      Card.deleteOne({ _id }).then((deleteResult) => {
        res.status(OK).send(deleteResult);
      });
    })
    .catch((err) => {
      if (err.statusCode) {
        next(err);
      } else if (err.name === CastError) {
        next(new NotFoundError('Передан невалидный id'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.statusCode) {
        next(err);
      } else if (err.name === CastError) {
        next(new DataError('Передан невалидный id'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.statusCode) {
        next(err);
      } else if (err.name === CastError) {
        next(new DataError('Передан невалидный id'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
};
