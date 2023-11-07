const Card = require('../models/card');
const { ERROR_DATA, ERROR_NOT_FOUND, ValidationError } = require('../utils/errorCodes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      console.error(err.message);
      res.status(500);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        console.error(err.message);
        res.status(500);
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne({ _id: req.params.cardId })
    .then((deleteResult) => {
      if (deleteResult.deletedCount === 0) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(deleteResult);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500);
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500);
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500);
    });
};
