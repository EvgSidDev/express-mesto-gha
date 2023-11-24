const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  ERROR_DATA,
  ERROR_NOT_FOUND,
  ValidationError,
  CastError,
  OK,
  OK_CREATE,
  SERVER_ERROR,
} = require('../utils/httpConstants');
const ServerError = require('../errors/ServerError');
const DataError = require('../errors/DataError');
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');


module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch((err) => {
      console.error(err.message);
      next(new ServerError(message));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(OK_CREATE).send(card))
    .catch((err) => {
      if (err.name === ValidationError) {
        next(new DataError(err.message));
      } else {
        console.error(err.message);
        next(new ServerError(message));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const _id = req.params.cardId;
  Card.findById({ _id })
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалать чужие карточки');
      }
      Card.deleteOne({ _id }).then((deleteResult) => {
        if (deleteResult.deletedCount === 0) {
          throw new NotFoundError('Карточка не найдена');
        }
        res.status(OK).send(deleteResult);
      });
    })
    .catch((err) => {
      if (err.statusCode) {
        next(err);
        return;
      }
      if (err.name === CastError) {
        next(new NotFoundError('Передан невалидный id'));
      } else {
        console.error(err.message);
        next(new ServerError(message));
      }
    });
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode) {
        next(err);
        return;
      }
      if (err.name === CastError) {
        next(new DataError('Передан невалидный id'));
      } else {
        console.error(err.message);
        next(new ServerError(message));
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.statusCode) {
        next(err);
        return;
      }
      if (err.name === CastError) {
        next(new DataError('Передан невалидный id'));
      } else {
        console.error(err.message);
        next(new ServerError(message));
      }
    });
};
