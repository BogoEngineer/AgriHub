const express = require('express');

const {
    getUsers,
    updateUser,
    getProfile,
    createUser,
    deleteUser,
    getNurseries,
    deleteNursery,
    addNursery,
    orderProduct,
    cancelOrder,
    plantSeedling,
    removeSeedling,
    useTreatment,
    changeState,
    getSeedlings,
    getProducts,
    getOrders,
    commentProduct,
    getProductSpecification,
    goShopping
} = require('../functionalities/users.js');

const User = require('../collections/User.js');

const router = express.Router();

router.route('/')
    .get(getUsers)
    .put(createUser);

router.route('/:id')
    .put(updateUser)
    .get(getProfile)
    .delete(deleteUser);

router.route('/:id/nurseries')
    .get(getNurseries)
    .put(addNursery);

router.route('/:id/nurseries/:idNur')
    .delete(deleteNursery)
    .get(getSeedlings);

router.route('/:id/shop')
    .get(goShopping)

router.route('/:id/shop/:proName&:company')
    .get(getProductSpecification);

router.route('/:id/shop/:proName&:company&:idNur')
    .put(orderProduct);

router.route('/:id/shop/:proName&:company/comment')
    .put(commentProduct);

router.route('/:id/nurseries/:idNur&:add&:parameter')
    .put(changeState)

router.route('/:id/nurseries/:idNur/warehouse')
    .get(getProducts);

router.route('/:id/nurseries/:idNur/warehouse/orders')
    .get(getOrders)

router.route('/:id/nurseries/:idNur/warehouse/orders/:idOr')
    .delete(cancelOrder);

router.route('/:id/nurseries/:idNur&:position/seedlings/:idSeed')
    .put(plantSeedling)
    .delete(removeSeedling);

router.route('/:id/seedlings/:idSeed/treatments/:idTr')
    .put(useTreatment);

module.exports = router;