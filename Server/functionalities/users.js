const mongoose = require('mongoose');
const User = require('../collections/User.js');
const Nursery = require('../collections/Nursery.js');
const Order = require('../collections/Order.js');
const Product = require('../collections/Product.js');
const Company = require('../collections/Company.js');
const Review = require('../collections/Review.js');



// PUT /users/:id
// privilege: LoggedInUser
exports.getProfile = async (req, res, next) => {
    const query_result = await User.findById(req.params.id).populate('nurseries');
    return res.status(200).json({
        success: true,
        data: query_result
    });
}

// GET /users/:id/nurseries
// privilege: LoggedInUser
exports.getNurseries = async (req, res, next) => {
    const query_result = await Nursery.find({ user: req.params.id });

    res.status(200).json({
        success: true,
        data: query_result
    });
}

// PUT /users/:id/nurseries
// privilege: LoggedInUser
exports.addNursery = async (req, res, next) => {
    req.body.user = req.params.id;
    const query_result = await Nursery.create(req.body);
    res.status(201).json({
        success: true,
        data: query_result
    });
}

// DELETE /users/:id/nurseries/:idNur
// privilege: LoggedInUser
exports.deleteNursery = async (req, res, next) => {
    const query_result = await Nursery.findById(req.params.idNur);
    query_result.remove();
    res.status(200).json({
        success: true,
        data: query_result
    });
}

// PUT /users/:id/nurseries/:idNur&:add&:parameter
// privilege: LoggedInUsers
exports.changeState = async (req, res, next) => {
    if (req.params.parameter == "water") {
        const query_result = await Nursery.findById(req.params.idNur);
        query_result.water += parseInt(req.params.add);
        query_result.save();
        res.status(200).json({
            success: true,
            data: query_result
        });
    } else if (req.params.parameter == "temperature") {
        const query_result = await Nursery.findById(req.params.idNur);
        query_result.temperature += parseInt(req.params.add);
        query_result.save();
        res.status(200).json({
            success: true,
            data: query_result
        });
    } else {
        console.log(err);
        res.status(400).json({
            success: false
        });
    }
}

// GET /users/:id/nurseries/:idNur
// privilege: LoggedInUsers
exports.getSeedlings = async (req, res, next) => {
    const query_result = await Product.find({
        type: "seedling",
        nursery: req.params.idNur,
        inWarehouse: false
    }).populate({ path: 'company', select: 'full_name' });
    res.status(200).json({
        success: true,
        data: query_result
    });
}


// GET /users/:id/nurseries/:idNur/warehouse
// privilege: LoggedInUsers
exports.getProducts = async (req, res, next) => {
    query_result = await Product.aggregate([
        { "$match": { inWarehouse: true, nursery: mongoose.Types.ObjectId(req.params.idNur) } },
        { "$group": { _id: { name: "$name", company: "$company", type: "$type" }, quantity: { $sum: 1 } } },
        { "$project": { _id: 0, name: "$_id.name", company: "$_id.company", type: "$_id.type", quantity: "$quantity" } },
        { $lookup: { from: 'Company', localField: 'company', foreignField: '_id', as: 'cmp' } }
    ]);

    for (const item of query_result) {
        item.comp = item.cmp[0].full_name;
        delete item.cmp;
    }

    res.status(200).json({
        success: true,
        data: query_result
    });
}

// GET /users/:id/nurseries/:idNur/warehouse/orders
// privilege: LoggedInUser
exports.getOrders = async (req, res, next) => {
    query_result = await Order.aggregate([
        { "$match": { status: { $in: ['on hold', 'travelling'] }, nursery: mongoose.Types.ObjectId(req.params.idNur) } },
        { $lookup: { from: 'Product', localField: 'product', foreignField: '_id', as: 'prod' } },
        { "$group": { _id: { name: "$prod.name", company: "$company", type: "$prod.type" }, quantity: { $sum: 1 } } },
        { "$project": { _id: 0, name: "$_id.name", company: "$_id.company", type: "$_id.type", quantity: "$quantity" } },
        { $lookup: { from: 'Company', localField: 'company', foreignField: '_id', as: 'cmp' } }
    ]);
    for (const item of query_result) {
        item.comp = item.cmp[0].full_name;
        item.name = item.name[0];
        item.type = item.type[0];
        delete item.cmp;
    }
    res.status(200).json({
        success: true,
        data: query_result
    });
}
// DELETE users/:id/nurseries/:idNur/warehouse/orders/:namePro&:idComp
// privilege: LoggedInUser
exports.cancelOrder = async (req, res, next) => {
    const query_result = await Order.aggregate([
        { $lookup: { from: 'Product', localField: 'product', foreignField: '_id', as: 'prod' }},
        { $project: {name:"$prod.name", company: "$company", user: "$user", nursery: "$nursery", status: "$status"}},
        { "$match": {
            status: { $in: ['on hold', 'travelling'] },
            company: mongoose.Types.ObjectId(req.params.idComp),
            nursery: mongoose.Types.ObjectId(req.params.idNur),
            $expr: {$eq: ["$name" , [req.params.namePro]]}
        }},
    ]);
    company = await Company.findById(req.params.idComp);
    company.postman += 1;
    company.save();
    let pr = await Product.find({
        name: req.params.namePro,
        company: req.params.idComp,
        available: false,
        inWarehouse: false,
        nursery: null
    });
    pr.forEach(product => {
        product.available = true;
        product.nursery = null; 
        product.save();
    });
    for (order of query_result){
        await Order.findByIdAndRemove(order._id);
    }
    res.status(200).json({
        success: true,
        data: query_result
    });
}

// PUT /users/:id/seedlings/manage
// privilege: LoggedInUsers
exports.plantSeedling = async (req, res, next) => {
    data = req.body.data;
    const query_result = await Product.findOneAndUpdate({
        company: data.company,
        name: data.name,
        inWarehouse: true,
        nursery: data.nursery
    },
        {
            inWarehouse: false,
            position: data.position,
            plantedAt: Date.now()
        });

    const update = await Nursery.findById(data.nursery);
    update.num_of_seedlings += 1;
    update.save();
    res.status(200).json({
        succes: true,
        data: query_result
    });
}

// DELETE /users/:id/nurseries/:nur_id/seedlings/:seed_id
// privilege: LoggedInUsers
exports.removeSeedling = async (req, res, next) => {
    let data = req.params;
    const query_result = await Product.findByIdAndUpdate(data.seed_id, { progress: -1 });
    const update = await Nursery.findById(data.nur_id);
    update.num_of_seedlings -= 1;
    update.save();
    let day = 60000 //86400000
    setTimeout(next, day);
    res.status(200).json({
        success: true,
        data: query_result
    });
}

// remove seedling after a day
exports.perish = async (req, res) => {
    await Product.findByIdAndRemove(req.params.seed_id);
}

// PUT /users/:id/seedlings/treat
// privilege: LoggedInUsers
exports.useTreatment = async (req, res, next) => {
    // better mechanism for solving this is needed
    let data = req.body.data;
    const treatment = await Product.findOneAndUpdate(
        {
            name: data.tr_name,
            company: data.tr_company,
            inWarehouse: true,
            nursery: data.nur_id
        },
        {
            inWarehouse: false
        });
    const seedling = await Product.findOneAndUpdate(
        {
            nursery: data.nur_id,
            name: data.sd_name,
            company: data.sd_company,
            position: data.sd_position
        },
        {
            treatment: treatment._id
        }) //this is where you update seedlings progress
    res.status(200).json({
        success: true,
        data: seedling.position
    });
}

// GET /users/:id/shop
// privilege: LoggedInUser
exports.goShopping = async (req, res, next) => {
    const shop = await Product.aggregate([ // available: maybe true isn't needed bcs we want to show availability (in shop) field to user
        { $group: { _id: { name: "$name", company: "$company", type: "$type", price: "$price" }, quantity: { $sum: 1 }, available_arr: { $push: "$available" } } },
        { $project: { _id: 0, name: "$_id.name", company: '$_id.company', type: "$_id.type", price: "$_id.price", quantity: "$quantity", available: { $in: [true, "$available_arr"] }, available_arr: "$available_arr" } },
        { $lookup: { from: 'Company', localField: 'company', foreignField: '_id', as: 'cmp' } }
    ]);
    //shop.company = (await Company.findById(shop.company)).name;

    // da li ovde treba da bude aktuelna kolicina u prodavnici ili kolicina koju je kompanija unela pri unosu proizvoda u prodavnicu??

    for (const item of shop) {
        item.quantity = item.available_arr.filter(av => { if (av) return av; }).length;
        item.comp = item.cmp[0].full_name;
        delete item.cmp;
        aggregObject = (await Review.getAverageRating(item.name, item.company))[0];
        if (aggregObject) {
            item.average_rating = aggregObject.averageRating;
        } else {
            item.average_rating = 0;
        }
    }

    res.status(200).json({
        success: true,
        data: shop
    });
}

// GET /users/:id/shop/:proName&:company
// privilege: LoggedInUser
exports.getProductSpecification = async (req, res, next) => {
    const comments = await Review.find({
        product: req.params.proName,
        company: req.params.company,
    }).select('comment rating user -_id');

    result = [];

    for (let comment of comments) {
        let user = (await User.findById(comment.user))
        comment = comment.toJSON()
        comment.user = user.username;
        result.push(comment);
    }

    res.status(200).json({
        success: true,
        data: result
    })
}

// PUT /users/:id/shop/:idNur
// privilege: LoggedInUser
exports.orderProducts = async (req, res, next) => {
    try {
        let products = req.body.data;
        products.forEach(product => {
            let iterable = [];
            for (let i = 0; i < product.number; i++) {
                iterable.push(i);
            }
            for (let num of iterable) {
                this.orderOneProduct(product, req.params.idNur, req.params.id);
            }
        });
        res.status(201).json({
            success: true
        });
    } catch (err) {
        res.status(400).json({
            success: false
        });
    }
}

//helper
exports.orderOneProduct = async (req, idNur, idUser) => {
    const product = await Product.findOneAndUpdate({
        name: req.name,
        company: req.company,
        available: true
    }, { available: false });
    let temp = {};
    temp.company = req.company;
    temp.product = product._id;
    temp.user = idUser;
    temp.nursery = idNur;
    temp.date = Date.now();
    const query_result = await Order.create(temp);
}

// PUT /users/:id/shop/:proName&:company/comment
// privilege: LoggedInUser
exports.commentProduct = async (req, res, next) => {
    const orders = await Order.find({
        user: req.params.id,
        company: req.params.company
    }).populate('product');

    let ordered = false;
    console.log(orders);
    orders.forEach(order => {
        if (order.product != null)
        if(order.product.name == req.params.proName) ordered = true;
    });

    if (!ordered) {
        res.status(200).json({
            success: false,
            explanation: "This user hasn't ordered this product yet!"
        });
    } else {
        review = await Review.create({
            user: mongoose.Types.ObjectId(req.params.id),
            product: req.params.proName,
            company: mongoose.Types.ObjectId(req.params.company),
            rating: req.body.rating,
            comment: req.body.comment
        });
        res.status(200).json({
            success: true,
            data: review
        });
    }
}