const mongoose = require('mongoose');
const User = require('../collections/User.js');
const Nursery = require('../collections/Nursery.js');
const Order = require('../collections/Order.js');
const Product = require('../collections/Product.js');
const Company = require('../collections/Company.js');
const Review = require('../collections/Review.js');

// GET /users/
// privilege: Admin
exports.getUsers = async (req, res, next) => {
    const query_result = await User.find();
    return res.status(200).json({
        success: true,
        data: query_result
    });
}

// PUT /users/:id
// privilege: Admin and LoggedInUser
exports.updateUser = async (req, res, next) => {
    try{
        const query_result = await User.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json({
            success: true,
        });
    }catch(err){
        console.log(err);
        return res.status(400).json({
            success:false
        })
    }
    
}

// PUT /users/:id
// privilege: LoggedInUser
exports.getProfile = async (req, res, next) => {
    const query_result = await User.findById(req.params.id).populate('nurseries');
    return res.status(200).json({
        success: true,
        data: query_result
    });
}

// PUT /users/
// privilege: Public
exports.createUser = async (req, res, next) => {
    try{
        const query_result = await User.create(req.body);
        return res.status(201).json({
            success: true,
            data: query_result
        });
    }catch(err){
        console.log(err);
        return res.status(400).json({
            success: false
        });
    }
}

// DEL /users/:id
// privilege: Admin
exports.deleteUser = async (req, res, next) => {
    try{
        const query_result = await User.findById(req.params.id);
        query_result.remove();
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

// GET /users/:id/nurseries
// privilege: LoggedInUser
exports.getNurseries = async (req, res, next) => {
    const query_result = await Nursery.find({user: req.params.id});

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
exports.changeState = async(req, res, next) => {
    if(req.params.parameter == "water"){
        const query_result = await Nursery.findById(req.params.idNur);
        query_result.water += parseInt(req.params.add);
        query_result.save();
        res.status(200).json({
            success: true,
            data: query_result
        });
    }else if(req.params.parameter == "temperature"){
        const query_result = await Nursery.findById(req.params.idNur);
        query_result.temperature += parseInt(req.params.add);
        query_result.save();
        res.status(200).json({
            success: true,
            data: query_result
        });
    }else{
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
    }).populate({path: 'company', select:'full_name'});
    res.status(200).json({
        success: true,
        data: query_result
    });
}


// GET /users/:id/nurseries/:idNur/warehouse
// privilege: LoggedInUsers
exports.getProducts = async (req, res, next) => {
    query_result = await Product.aggregate([
        {"$match" : {inWarehouse: true, nursery: mongoose.Types.ObjectId(req.params.idNur)}}, 
        {"$group" : {_id : {name:"$name", company:"$company"}, quantity: {$sum: 1}}}, 
        {"$project" : {_id:0, name:"$_id.name", company:"$_id.company", quantity: "$quantity"}}
    ]);
    
    res.status(200).json({
        success: true,
        data: query_result
    });
}

// GET /users/:id/nurseries/:idNur/warehouse/orders
// privilege: LoggedInUser
exports.getOrders = async (req, res, next) => {
    const query_result = await Order.find({nursery: req.params.idNur});
    res.status(200).json({
        success: true,
        data: query_result
    });
}
// DELETE users/:id/nurseries/:idNur/warehouse/orders/:idOr
// privilege: LoggedInUser
exports.cancelOrder = async (req, res, next) => {
    const query_result = await Order.findById(req.params.idOr);
    if(query_result.status == "delivered") {
        res.status(400).json({
            success: false,
            explanation: "This order has already been delivered!"
        });
    }else{
        company = await Company.findById(query_result.company);
        company.postman += 1;
        company.save();
        await Product.findByIdAndUpdate(query_result.product, {
            available: true
        }); // returns an item to the shop ---- not tested
        query_result.remove();
        res.status(200).json({
            success: true,
            data: query_result
        });
    }
}

// PUT /users/:id/nurseries/:idNur&:position/seedlings/:idSeed
// privilege: LoggedInUsers
exports.plantSeedling = async (req, res, next) => {
    const query_result = await Product.findById(req.params.idSeed);
    if(query_result.nursery){
        res.status(400).json({
            success: false,
            explanation: "This seedling is already planted"
        });
        return;
    }else{
        await query_result.update({
            inWarehouse: false,
            position: req.params.position,
            plantedAt: Date.now(),
            //nursery: mongoose.Types.ObjectId(req.params.idNur) ovo se radi u OrderProduct 
        });
        query_result.save();
    }
    const update = await Nursery.findById(req.params.idNur);
    update.num_of_seedlings += 1;
    update.save();
    res.status(200).json({
        succes: true,
        data: query_result
    });
}

// DELETE /users/:id/nurseries/:idNur&:position/seedlings/:idSeed
// privilege: LoggedInUsers
exports.removeSeedling = async (req, res, next) => {
    const query_result = await Product.findById(req.params.idSeed);
    const update = await Nursery.findById(req.params.idNur);
    update.num_of_seedlings -= 1;
    update.save();
    query_result.remove();
    res.status(200).json({
        success: true,
        data: query_result
    });
}

// PUT /users/:id/seedlings/:idSeed/treatments/:idTr
// privilege: LoggedInUsers
exports.useTreatment = async (req, res, next) => {
    // better mechanism for solving this is needed
    req.body.treatment = req.params.idTr;
    const query_result = await Product.findByIdAndUpdate(req.params.idSeed, req.body);
    res.status(200).json({
        success: true,
        data: query_result
    });
}

// GET /users/:id/shop
// privilege: LoggedInUser
exports.goShopping = async (req, res, next) => {
    const shop = await Product.aggregate([
        {$match: {}}, // available: true isn't needed bcs we want to show availability (in shop) field to user
        {$group: {_id: {name:"$name", company:"$company", type:"$type"}, quantity: {$sum: 1}, available_arr: {$push: "$available"}}},
        {$project: {_id:0, name:"$_id.name", company: '$_id.company', type:"$_id.type", quantity: "$quantity", available: { $in: [true, "$available_arr"]}}},
        {$lookup: {from: 'Company', localField: 'company', foreignField: '_id', as: 'cmp'}}
    ]);

    //shop.company = (await Company.findById(shop.company)).name;

    // da li ovde treba da bude aktuelna kolicina u prodavnici ili kolicina koju je kompanija unela pri unosu proizvoda u prodavnicu??

    for (const item of shop) {
        item.comp = item.cmp[0].full_name;
        delete item.cmp;
        delete item.company;
        aggregObject = (await Review.getAverageRating(item.name, item.company))[0];
        if(aggregObject){
            item.average_rating = aggregObject.averageRating;
        }else{
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

// PUT /users/:id/shop/:proName&:company&:idNur
// privilege: LoggedInUser
exports.orderProduct = async (req, res, next) => {
    try{
        const product = await Product.findOne({
            name: req.params.proName,
            company: req.params.company
        })
        product.nursery = req.params.idNur;
        product.save();
        req.body.company = req.params.company;
        req.body.product = product._id;
        req.body.user = req.params.id;
        req.body.nursery = req.params.idNur;
        req.body.date = Date.now();
        const query_result = await Order.create(req.body);
        //Updating the shop -- fix for quantity (?)
        await Product.findByIdAndUpdate(product._id, 
            {available: false})

        company = await Company.findById(req.params.company);
        company.postman -= 1;
        company.save();
        
        res.status(201).json({
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

// PUT /users/:id/shop/:proName&:company/comment
// privilege: LoggedInUser
exports.commentProduct = async (req, res, next) => {
    const product = await Product.find({
        name: req.params.proName,
        company: req.params.company
    });

    const order = await Order.findOne({
        user: req.params.id, 
        product: product.idPro,
        company: req.params.company
    });
    
    const comment = await Review.findOne({
        user: req.params.id,
        product: product.name,
        company: product.company
    });

    if(comment){
        res.status(400).json({
            success: false,
            explanation: "This user has already reviewed this product!"
        });
    }else if(order == null){
        res.status(400).json({
            success: false,
            explanation: "This user hasn't ordered this product yet!"
        });
    }else{
        req.body.user = req.params.id
        req.body.product = product.name
        req.body.company = product.company
        review = await Review.create(req.body);
        res.status(200).json({
            success: true,
            data: review
        });
    }
}