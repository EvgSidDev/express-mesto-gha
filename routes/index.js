const router = require('express').Router();
const { ERROR_NOT_FOUND } = require('../utils/httpConstants');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.get('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
