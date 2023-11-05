const Card = require('../models/card');
const { ERROR_DATA, ERROR_NOT_FOUND, ValidationError } = require('../utils/errorCodes');
const { isURL } = require('../utils/util');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (!isURL(link)) {
    res.status(ERROR_DATA).send({ message: 'Указанное значение не является ссылкой' });
    return;
  }
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(ERROR_DATA).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
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
    .catch((err) => res.status(500).send({ message: err.message }));
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
      }
      res.status(200).send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
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
      }
      res.status(200).send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
