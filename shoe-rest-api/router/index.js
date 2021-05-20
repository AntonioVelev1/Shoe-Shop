const router = require('express').Router();
const users = require('./user');
const products = require('./product');

router.use('/users', users);
router.use('/products', products);


module.exports = router;