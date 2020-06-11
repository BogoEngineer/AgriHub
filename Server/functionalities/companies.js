const mongoose = require('mongoose');
const Company = require('../collections/Company.js');
const Product = require('../collections/Product.js');
const Order = require('../collections/Order.js');
const Review = require('../collections/Review.js');
const Nursery = require('../collections/Nursery.js');
const User = require('../collections/User.js');

const http = require('http');


const api_key = 'AjdzEb29QaLeweeWx5UxjjnMVZ2PjojQ5PM-yhTUSPvDufiAje1QCDCFgopdHwU_';

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
    const time = req.body.time;

    const arrayOfArticles = []

    for (let i = 0; i < quantity; i++) {
        let article = {
            "company": company,
            "type": type,
            "name": name,
            "price": price,
            "time": time
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
        { $match: { company: mongoose.Types.ObjectId(req.params.id) } },
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
    try {
        query_result = await Product.deleteMany({ // Pre 'remove' middleware won't be triggered this way!
            company: this._id,
            name: req.params.proName,
            company: req.params.id,
            available: false
        });
        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false
        });
    }
}

exports.deleteReviewsForDeletedProduct = async (req, res) => {
    try {
        query_result = await Review.deleteMany({
            product: req.params.proName,
            company: req.params.id
        });
        res.status(200).json({
            success: true,
            data: query_result
        });
    } catch (err) {
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
    let orders = await Order.aggregate([
        { $lookup: { from: 'Product', localField: 'product', foreignField: '_id', as: 'prod' } },
        { $lookup: { from: 'Nursery', localField: 'nursery', foreignField: '_id', as: 'nurs' } },
        { $lookup: { from: 'User', localField: 'user', foreignField: '_id', as: 'usr' } },
        { $project: { prd: { $arrayElemAt: ["$prod.name", 0] }, nrs: { $arrayElemAt: ["$nurs.name", 0] }, sr: { $arrayElemAt: ["$usr.username", 0] }, status: "$status", company: "$company", date: "$date", _id: "$_id" } },
        { $match: { status: order.status, nrs: order.nursery, sr: order.user, prd: order.product, company: mongoose.Types.ObjectId(cmp) } },
    ])
    if (req.params.outcome == "accept") {
        let company = await Company.findOne({ full_name: order.company });
        let usr = await User.findOne({ username: order.user })
        let nursery = await Nursery.findOne({ user: mongoose.Types.ObjectId(usr._id), name: order.nursery });
        if (company.postman > 0) {
            company.postman -= 1;
            company.save();
            var update_array = [];
            for (let elem of orders) {
                req.params.id1 = elem._id;
                let update = await Order.findById(req.params.id1);
                update_array.push(update);
                update.status = "travelling"
                update.save();
            }
            res.status(200).json({
                success: true,
            });
            //some logic behind waiting for product to be delivered...

            let nurseryLocation = await this.getLocation(nursery.location);
            let companyLocation = await this.getLocation(company.place);

            let time_for_delivery = await this.getTravelTime(nurseryLocation, companyLocation) // given in minutes

            time_for_delivery *= 60000;
            //console.log("time", time_for_delivery);
            //console.log(nurseryLocation, companyLocation)

            req.body.deliver = update_array;
            setTimeout(next, time_for_delivery); // every delivery takes one minute for now
        } else {
            for (let elem of orders) {
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
    } else if (req.params.outcome == "decline") {
        res.status(200).json({
            success: true,
        });
        for (let elem of orders) {
            req.params.id1 = elem._id;
            let update = await Order.findById(req.params.id1);
            update.status = "declined"
            update.save();
        }
    }

}

exports.getLocation = async (place) => {
    place=place.split(', ')
    let position_url = `http://dev.virtualearth.net/REST/v1/Locations?q=${place[0]}`;
    for(let i=1; i<place.length; i++){
        position_url+=`%20${place[i]}`;
    }
    position_url += `&maxResults=1&key=${api_key}`;

    let coordinates = [0,0];

    let req = await new Promise(function(resolve, reject){
            let req = http.get(position_url, function (res) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
    
            // Buffer the body entirely for processing as a whole.
            let bodyChunks = [];
            res.on('data', function (chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function () {
                let body = Buffer.concat(bodyChunks);
                //console.log('BODY: ' + body);
                // ...and/or process the entire body here.
                resolve(coordinates = JSON.parse(body).resourceSets[0].resources[0].point.coordinates);
            })
            req.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                reject(e);
            });
        });
    })
        

    return coordinates;
}

exports.getTravelTime = async (location1, location2) => {
    
    let position_url = `http://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${location1[0]},${location1[1]}&destinations=${location2[0]},${location2[1]}&travelMode=driving&key=${api_key}`;
    //console.log(position_url)
    let travelTime = 0;

    let req = await new Promise(function(resolve, reject){
            let req = http.get(position_url, function (res) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
    
            // Buffer the body entirely for processing as a whole.
            let bodyChunks = [];
            res.on('data', function (chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function () {
                let body = Buffer.concat(bodyChunks);
                //console.log('BODY: ' + body);
                // ...and/or process the entire body here.
                resolve(travelTime = JSON.parse(body).resourceSets[0].resources[0].results[0].travelDuration);
                //console.log(travelTime);
            })
            req.on('error', function (e) {
                console.log('ERROR: ' + e.message);
                reject(e);
            });
        });
    })
        

    return travelTime;
}

// DELETE /companies/:id/orders/:id1&:outcome
// privilege: LoggedInCompany
exports.deliverOrders = async (req, res) => {
    let update_array = req.body.deliver;
    for (let update of update_array) {
        user_nursery = update.nursery;
        await Product.findByIdAndUpdate(update.product,
            {
                nursery: user_nursery,
                inWarehouse: true
            });

        update.status = "delivered";
        update.save();
    }
    company.postman += 1;
    company.save();
}

// GET /companies/:id
// privilege: LoggedInCompany
exports.getOrders = async (req, res, next) => {
    try {
        let orders = await Order.aggregate([
            {
                $match:
                {
                    company: mongoose.Types.ObjectId(req.params.id),
                    status: { $in: ['on hold', 'travelling', 'high priority'] }
                }
            },
            { $lookup: { from: 'Product', localField: 'product', foreignField: '_id', as: 'prod' } },
            {
                $group: { _id: { abc: "$user", nursery: "$nursery", company: "$company", status: "$status", product: { $arrayElemAt: ["$prod.name", 0] } }, quantity: { $sum: 1 }, date: { $first: "$date" } }

            },
            { $project: { _id: 0, abc: "$_id.abc", date: "$date", nursery: "$_id.nursery", company: "$_id.company", status: "$_id.status", product: "$_id.product", quantity: "$quantity", user: "$user" } },
            {
                $lookup:
                    { from: 'Company', localField: 'company', foreignField: '_id', as: 'comp' }
            },
            {
                $lookup:
                    { from: 'User', localField: 'abc', foreignField: '_id', as: 'usr' }
            },
            {
                $lookup:
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
    } catch (err) {
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
        },
        company: mongoose.Types.ObjectId(req.params.id)
    });

    for (var d = month_ago; d < now; d.setDate(d.getDate() + 1)) {
        cnt = 0;
        for (let order of orders) {
            if (order.date.getDate() === d.getDate()) {
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