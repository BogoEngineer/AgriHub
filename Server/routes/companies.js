const express = require('express');

const {
    getOrders,
    getProfile,
    addProduct,
    deleteProduct,
    deleteReviewsForDeletedProduct,
    handleOrders,
    deliverOrders,
    getProducts,
    getProductSpecifications,
    getOrderStatistics
} = require('../functionalities/companies.js');

const Company = require('../collections/Company.js');

const router = express.Router();

router.route('/')
    .get(getProfile)

router.route('/:id')
    .get(getOrders)

router.route('/:id/chart')
    .get(getOrderStatistics);

router.route('/:id/products')
    .put(addProduct)
    .get(getProducts);

router.route('/:id/products/:proName')
    .get(getProductSpecifications);

router.route('/:id/products/:proName')
    .delete(deleteProduct, deleteReviewsForDeletedProduct);

router.route('/:id/orders/handle')
    .post(handleOrders, deliverOrders);
    
module.exports = router;

