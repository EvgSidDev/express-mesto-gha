const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const NotFoundError = require('./../errors/NotFound');
const {
  createUser,
  login,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}),login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/[a-z1-9\-\.\/\_\~\:\\\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*/),
  }).unknown(true),
}), createUser);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

router.use(errors())

module.exports = router;
