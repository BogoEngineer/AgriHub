const express = require('express');

const {
    getRequests,
    createRequest,
    handleRequest,
    getUsers,
    getCompanies,
    createUser,
    createCompany,
    deleteCompany,
    deleteUser,
    updateCompany,
    updateUser,
    logIn,
    changePassword,
    getAllUsernames
} = require('../functionalities/admin.js');

const router = express.Router();

router.route('/usernames')
    .get(getAllUsernames);

router.route('/login/:role')
    .post(logIn)

router.route('/change-password/:new_password')
    .post(changePassword)

router.route('/requests/:type')
    .get(getRequests)
    .put(createRequest)

router.route('/requests/:decision')
    .post(handleRequest);

router.route('/users')
    .get(getUsers)
    .put(createUser)

router.route('/companies')
    .get(getCompanies)
    .put(createCompany)

router.route('/users/:id')
    .delete(deleteUser)
    .post(updateUser)

router.route('/companies/:id')
    .delete(deleteCompany)
    .post(updateCompany)
    
module.exports = router;