const productModel = require('../models/productModel');

module.exports = {
    getProducts(req, res, next) {
        productModel.find().then(products => res.json(products))
        .catch(next);
    }
}