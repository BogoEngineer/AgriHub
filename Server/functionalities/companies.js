const Company = require('../collections/Company.js');
const Product = require('../collections/Product.js');
const Order = require('../collections/Order.js');
const Review = require('../collections/Review.js');

// GET companies/
// privilege: Admin
exports.getCompanies = async (req, res, next) => {
    query_result = await Company.find();

    return res.status(200).json({
        success: true,
        data: query_result
    });
}

// PUT companies/
// privilege: Public
exports.createCompany = async (req, res, next) => {
    try{
        query_result = await Company.create(req.body);
        return res.status(201).json({
            success: true,
            data: query_result
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false
        })
    }
}

// PUT /companies/:id
// privilege: Admin and LogInCompany
exports.updateCompany = async (req, res, next) => {
    query_result = await Company.findByIdAndUpdate(req.params.id);
    res.status(200).json({
        success: true,
        data: query_result
    })
}

// GET /companies/:id
//privilege: LogInCompany
exports.getProfile = async (req, res, next) => {
    query_result = await Company.findById(req.params.id)
    res.status(200).json({
        success: true,
        data: query_result
    })
}

// DEL /companies/:id
// privilege: Admin
exports.deleteCompany = async (req, res, next) => {
    try{
        query_result = await Company.findByIdAndRemove(req.params.id);
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
    query_result = await Product.find({company: req.params.id}).distinct('name');
    res.status(201).json({
        success: true,
        data: query_result
    });
}

// GET /companies/:id/products/:proName
// privilege: LoggedInCompany
exports.getProductSpecifications = async (req, res, next) => {
    avgRating = (await Review.getAverageRating(req.params.proName, req.params.id))[0].averageRating;
    comments = await Review.find({
        product: req.params.proName,
        company: req.params.id
    });
    res.status(200).json({
        success: true,
        data: {
            avgRating: avgRating,
            comments: comments
        }
    })
}

// DELETE /companies/:id/products/:proName
// privilege: LoggedInCompany
exports.deleteProduct = async (req, res, next) => {
    try{
        query_result = await Product.deleteMany({ // Pre 'remove' middleware won't be triggered this way!
        company: this._id,
            name: req.params.proName,
            company: req.params.id
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

// DELETE /companies/:id/orders/:id1&:outcome
// privilege: LoggedInCompany
exports.handleOrder = async (req, res, next) => {
    try{
        query_result = await Order.findById(req.params.id1);
        if(req.params.outcome == "accept"){
            company = await Company.findById(query_result.company);
            nursery = await Nursery.findById(query_result.nursery);
            if(company.postman > 0){
                company.postman -= 1;
                company.save();
                query_result.status = "travelling"
                query_result.save();
                //some logic behind waiting for product to be delivered...
        
                time_for_delivery = 60000;
                console.log(time_for_delivery);
                setTimeout(next, time_for_delivery); // every delivery takes one minute for now
            }else{
                res.status(400).json({
                    success: false,
                    explanation: "There are no postmen to deliver this order!"
                });
            }
        }else if(req.params.outcome == "decline"){
            res.status(200).json({
                success: true,
                data: query_result
            });
            query_result.remove(); // can be removed since it is not needed for the archive
        }else{
            res.status(400).json({
                success: false
            });
        }
    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false
        });
    }
}

// DELETE /companies/:id/orders/:id1&:outcome
// privilege: LoggedInCompany
exports.deliverOrder = async (req, res) => {
    user_nursery = query_result.nursery;
    await Product.findByIdAndUpdate(query_result.product, 
        {nursery: user_nursery,
        inWarehouse: true});
    
    query_result.status = "delivered";
    query_result.save();
    
    res.status(200).json({
        success: true,
        data: {nursery: user_nursery}
    });

    company.postman += 1;
    company.save();
    //query_result.remove();
}
