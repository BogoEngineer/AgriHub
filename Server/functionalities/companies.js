const mongoose = require('mongoose');
const Company = require('../collections/Company.js');
const Product = require('../collections/Product.js');
const Order = require('../collections/Order.js');
const Review = require('../collections/Review.js');
const Nursery = require('../collections/Nursery.js');
const User = require('../collections/User.js');

// GET /companies/:id
//privilege: LogInCompany
exports.getProfile = async (req, res, next) => {
    query_result = await Company.findById(req.params.id)
    res.status(200).json({
        success: true,
        data: query_result
    })
}

// PUT /companies/:id/products
// privilege: LoggedInCompany
exports.addProduct = async (req, res, next) => {
    const quantity = req.body.quantity;
    const company = req.params.id;
    const type = req.body.type;
    const name = req.body.name;
    const price = req.body.price;

    const arrayOfArticles = []

    for(let i=0; i<quantity; i++){
        let article = {
            "company": company,
            "type": type,
            "name": name,
            "price": price
        }

        arrayOfArticles.push(article);
    }

    const query_result = await Product.create(arrayOfArticles);
    res.status(201).json({
        success: true,
        data: query_result
    });
}

// GET /companies/:id/products
// privilege: LoggedInCompany
exports.getProducts = async (req, res, next) => {
    const shop = await Product.aggregate([ // available: maybe true isn't needed bcs we want to show availability (in shop) field to user
        { $match: {company: mongoose.Types.ObjectId(req.params.id)}}, 
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

// GET /companies/:id/products/:proName
// privilege: LoggedInCompany
exports.getProductSpecifications = async (req, res, next) => {
    const comments = await Review.find({
        product: req.params.proName,
        company: req.params.id,
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

// DELETE /companies/:id/products/:proName
// privilege: LoggedInCompany
exports.deleteProduct = async (req, res, next) => {
    try{
        query_result = await Product.deleteMany({ // Pre 'remove' middleware won't be triggered this way!
        company: this._id,
            name: req.params.proName,
            company: req.params.id,
            available: false
        });
        next();
    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false
        });
    }
}

exports.deleteReviewsForDeletedProduct = async (req, res) => {
    try{
        query_result = await Review.deleteMany({
            product: req.params.proName,
            company: req.params.id
        });
        res.status(200).json({
            success: true,
            data: query_result
        });
    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false
        });
    }
}

// POST /companies/:id/orders/handle
// privilege: LoggedInCompany
exports.handleOrders = async (req, res, next) => {
    let order = req.body.data.order;
    let cmp = req.body.data.company;
    req.params.outcome = req.body.data.outcome;
    let iter = new Array(order.quantity).fill(0);
    //console.log(order, cmp)
    let orders = await Order.aggregate([
        {$lookup: { from: 'Product', localField: 'product', foreignField: '_id', as: 'prod' }},
        {$lookup: { from: 'Nursery', localField: 'nursery', foreignField: '_id', as: 'nurs' }}, 
        {$lookup: { from: 'User', localField: 'user', foreignField: '_id', as: 'usr' }},
        {$project: {prd: {$arrayElemAt: [ "$prod.name", 0 ]}, nrs: {$arrayElemAt: [ "$nurs.name", 0 ]}, sr: {$arrayElemAt: [ "$usr.username", 0 ]}, status: "$status", company:"$company", date:"$date", _id:"$_id"}},  
        {$match: { status: order.status, nrs: order.nursery, sr: order.user, prd: order.product, company: mongoose.Types.ObjectId(cmp), date: new Date(order.date) } }, 
    ])
    if(req.params.outcome == "accept"){
        company = await Company.findOne({full_name: order.company});
        usr = await User.findOne({username: order.user})
        nursery = await Nursery.findOne({user: mongoose.Types.ObjectId(usr._id), name: order.nursery});
        if(company.postman > 0){
            company.postman -= 1;
            company.save();
            var update_array = [];
            for(let elem of orders){
                req.params.id1 = elem._id;
                let update = await Order.findById(req.params.id1);
                update_array.push(update);
                update.status = "travelling"
                update.save();
            }
            //some logic behind waiting for product to be delivered...
            req.body.deliver = update_array;
            time_for_delivery = 60000;
            setTimeout(next, time_for_delivery); // every delivery takes one minute for now
        }else{
            for(let elem of orders){
                req.params.id1 = elem._id;
                let update = await Order.findById(req.params.id1);
                update.status = "high priority"
                update.save();
            }
            res.status(200).json({
                success: false,
                explanation: "There are no postmen to deliver this order!"
            });
        }
    }else if(req.params.outcome == "decline"){
        res.status(200).json({
            success: true,
        });
        for(let elem of orders){
            req.params.id1 = elem._id;
            let update = await Order.findById(req.params.id1);
            update.status = "declined"
            update.save();
        }
    }

}

// DELETE /companies/:id/orders/:id1&:outcome
// privilege: LoggedInCompany
exports.deliverOrders = async (req, res) => {
    let update_array = req.body.deliver;
    for (let update of update_array){
        user_nursery = update.nursery;
        await Product.findByIdAndUpdate(update.product, 
            {nursery: user_nursery,
            inWarehouse: true});
        
        update.status = "delivered";
        update.save();
    }
    company.postman += 1;
    company.save();
    res.status(200).json({
        success: true,
    });
}

// GET /companies/:id
// privilege: LoggedInCompany
exports.getOrders = async (req, res, next) => {
    try{
        let orders = await Order.aggregate([
            { 
            $match: 
                {
                company: mongoose.Types.ObjectId(req.params.id),
                status: { $in: ['on hold', 'travelling', 'high priority']}
                }
            },
            { $lookup: { from: 'Product', localField: 'product', foreignField: '_id', as: 'prod' } },
            {
                $group: { _id: {abc:"$user", date:"$date", nursery: "$nursery", company: "$company", status: "$status", product: {$arrayElemAt: [ "$prod.name", 0 ]}}, quantity: { $sum: 1 } }
                     
            },
            { $project: { _id: 0, abc: "$_id.abc", date:"$_id.date", nursery: "$_id.nursery", company: "$_id.company", status: "$_id.status", product: "$_id.product",  quantity: "$quantity", user:"$user" } },
            { $lookup: 
                { from: 'Company', localField: 'company', foreignField: '_id', as: 'comp' }
            },
            { $lookup: 
                { from: 'User', localField: 'abc', foreignField: '_id', as: 'usr' }
            },
            { $lookup: 
                { from: 'Nursery', localField: 'nursery', foreignField: '_id', as: 'nurs' }
            }
        ])

        let response = [];
        for (order of orders) {
            response.push({
                status: order.status,
                company: order.comp[0].full_name,
                product: order.product,
                user: order.usr[0].username,
                nursery: order.nurs[0].name,
                date: order.date,
                quantity: order.quantity
            })
        }

        res.status(200).json({
            success: true,
            data: response
        })
    }catch(err){
        console.log(err);
    }
}

// GET /companies/:id/chart
// privilege: LoggedInCompany
exports.getOrderStatistics = async (req, res, next) => {
    var now = new Date();
    var month_ago = new Date();
    month_ago.setDate(now.getDate() - 30)
    var order_cnt = [];
    let orders = await Order.find({
        date: {
            $gte: month_ago,
            $lte: now
        }
    });

    for (var d = month_ago; d < now; d.setDate(d.getDate() + 1)) {
        cnt = 0;
        for(let order of orders) {
            if(order.date.getDate() === d.getDate()){
                cnt += 1;
            } 
        }
        order_cnt.push(cnt); 
    }

    res.status(200).json({
        success: true,
        data: order_cnt
    })
}