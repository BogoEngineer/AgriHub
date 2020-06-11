const express = require('express');

const {
    getProfile,
    getNurseries,
    deleteNursery,
    addNursery,
    orderProducts,
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
    goShopping,
    perish,
    sendMail
} = require('../functionalities/users.js');

const User = require('../collections/User.js');

const router = express.Router();

router.route('/:id')
    .get(getProfile)

router.route('/:id/nurseries')
    .get(getNurseries)
    .put(addNursery, sendMail);

router.route('/:id/nurseries/:idNur')
    .delete(deleteNursery)
    .get(getSeedlings);

router.route('/:id/shop')
    .get(goShopping)

router.route('/:id/shop/:proName&:company')
    .get(getProductSpecification);

router.route('/:id/shop/:idNur')
    .put(orderProducts);

router.route('/:id/shop/:proName&:company/comment')
    .put(commentProduct);

router.route('/:id/nurseries/:idNur&:add&:parameter')
    .put(changeState)

router.route('/:id/nurseries/:idNur/warehouse')
    .get(getProducts);

router.route('/:id/nurseries/:idNur/warehouse/orders')
    .get(getOrders)

router.route('/:id/nurseries/:idNur/warehouse/orders/:namePro&:idComp')
    .delete(cancelOrder);

router.route('/:id/seedlings/manage')
    .put(plantSeedling);

router.route('/:id/nurseries/:nur_id/seedlings/:seed_id')
    .delete(removeSeedling, perish);

router.route('/:id/seedlings/treat')
    .put(useTreatment);

module.exports = router;