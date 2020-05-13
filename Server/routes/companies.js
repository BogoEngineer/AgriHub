const express = require('express');

const {
    getCompanies,
    createCompany,
    getProfile,
    deleteCompany,
    updateCompany,
    addProduct,
    deleteProduct,
    deleteReviewsForDeletedProduct,
    handleOrder,
    deliverOrder,
    getProducts,
    getProductSpecifications
} = require('../functionalities/companies.js');

const Company = require('../collections/Company.js');

const router = express.Router();

router.route('/')
    .get(getCompanies)
    .put(createCompany);

router.route('/:id')
    .get(getProfile)
    .delete(deleteCompany)
    .put(updateCompany);

router.route('/:id/products')
    .put(addProduct)
    .get(getProducts);

router.route('/:id/products/:proName')
    .get(getProductSpecifications);

router.route('/:id/products/:proName')
    .delete(deleteProduct, deleteReviewsForDeletedProduct);

router.route('/:id/orders/:id1&:outcome')
    .delete(handleOrder, deliverOrder);
    
module.exports = router;

