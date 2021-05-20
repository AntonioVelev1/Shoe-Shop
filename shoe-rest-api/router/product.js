const express = require('express');
const router = express.Router();
const { productController } = require('../controllers');
const { auth } = require('../utils');

router.get('/all', productController.getProducts);
router.post('/create', auth(), productController.createProduct);
router.get('/details/:id', productController.getProduct);
router.put('/edit/:id', auth(), productController.editPorduct);
router.delete('/delete/:id', auth(), productController.deleteProduct);

module.exports = router;