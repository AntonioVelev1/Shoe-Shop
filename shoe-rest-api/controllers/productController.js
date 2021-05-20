const { userModel } = require('../models');
const productModel = require('../models/productModel');

function getProducts(req, res, next) {
    productModel.find()
        .populate('userId')
        .then(products => res.json(products))
        .catch(next);
}

function getProduct(req, res, next) {
    const productId = req.params.id;

    productModel.findById(productId)
        .populate('userId')
        .then(product => res.json(product))
        .catch(next);
}

function createProduct(req, res, next) {
    const { _id: userId } = req.user;

    productModel.create({ ...req.body, sallesman: userId })
    then(product => {
        res.status(200)
            .json(product);
    })
        .catch(next);
}

function editPorduct(req, res, next) {
    const productId = req.params.id;
    const { _id: userId } = req.user;

    productModel.findOneAndUpdate({ _id: productId, userId }, { ...req.body }, { new: true })
    then(updatedProduct => {
        if (updatedProduct) {
            res.status(200).json(updatedProduct);
        }
        else {
            res.status(400).json({ message: 'Not allowed!' });
        }
    })
        .catch(next);
}

function deleteProduct (req, res, next) {
    const productId = req.params.id;
    const { _id: userId } = req.user;

    Promise.all([
        productModel.findOneAndDelete({ _id: productId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { products: productId } })
    ])
        then(([deletedPoduct,_]) => {
            if(deleteProduct) {
                res.status(200).json(deleteProduct)
            }
            else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

function subscribe(req, res, next) {
    const productId = req.params.id;
    const { _id: userId } = req.user;

    productModel.findByIdAndUpdate({ _id: productId }, { $addToSet: { sallesman: userId } }, { new: true })
        then(updatedProduct => {
            res.status(200).json(updatedProduct);
        })
        .catch(next);
}

module.exports = {
    getProduct,
    getProducts,
    createProduct,
    editPorduct,
    deleteProduct,
    subscribe,
}