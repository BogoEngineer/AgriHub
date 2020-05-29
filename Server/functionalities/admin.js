const mongoose = require('mongoose');
const Company = require('../collections/Company.js');
const Product = require('../collections/Product.js');
const Order = require('../collections/Order.js');
const Review = require('../collections/Review.js');
const Nursery = require('../collections/Nursery.js');
const User = require('../collections/User.js');
const Request = require('../collections/Request.js');
const reqest = require('request');

// POST admin/login/:role
// privilege: All
exports.logIn = async (req, res, next) => {
    let role = req.params.role.toLowerCase();
    if(role == 'company'){
        let company = await Company.find({abbreviation: req.body.username, password: req.body.password});
        if(company.length == 0) {
            res.status(200).json({
                success: false,
                msg: "No user with given credentials."
            })
            return;
        }
        
        res.status(200).json({
            success: true,
            data: company[0]
        })
    }else {
        let admin = false;
        if(role == 'admin'){
            admin = true;
        }
        let user = await User.find({username: req.body.username, password: req.body.password, admin: admin});
        if(user.length == 0) {
            res.status(200).json({
                success: false,
                msg: "No user with given credentials."
            })
            return;
        }
        res.status(200).json({
            success: true,
            data: user[0]
        })
    }
}

// POST admin/change_password/:new_password
// privilege: All
exports.changePassword = async (req, res, next) => {
    let user = req.body;
    if(user.role == 'company'){
        let comp = await Company.findByIdAndUpdate(user._id, {
            password: req.params.new_password
        })
    }else{
        let usr = await User.findByIdAndUpdate(user._id, {
            password: req.params.new_password
        })
    }

    res.status(200).json({
        success: true
    })
}

// GET admin/requests/:type
// privilege: Admin
exports.getRequests = async (req, res, next) => {
    let requests = await Request.find({
        type: req.params.type
    })

    return res.status(200).json({
        success: true,
        data: requests
    });
}

// PUT admin/requests/:type
// privilege: Admin
exports.createRequest = async (req, res, next) => {
    let secret_key = '6Ldd6vwUAAAAAA0oJTqGNyZmwPAgLUQ1SdViPbpt';
    let verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${req.body.captcha}&remoteip=${req.connection.remoteAdress}`;
    reqest(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        if(body.succes !== undefined && !body.success){
            return res.json({
                success: false,
                msg: 'Failed captcha verification'
            })
        }
    })
    let request = await Request.create(req.body)
    return res.status(200).json({
        success: true,
        data: request
    });
}

// POST admin/requests/:decision
// privilege: Admin
exports.handleRequest = async (req, res, next) => {
    let request = await Request.findById(req.body._id);
    if(req.params.decision == 'decline'){
        //request.remove();
    }else {
        if(req.body.type=='user'){
            let user = await User.create(req.body);
        }else {
            let company = await Company.create(req.body);
        }  
    }
    request.remove(); //remove in any case
    return res.status(200).json({
        success: true,
        data: request
    });
}

// GET admin/companies
// privilege: Admin
exports.getCompanies = async (req, res, next) => {
    let query_result = await Company.find();

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


// POST /companies/:id
// privilege: Admin and LogInCompany
exports.updateCompany = async (req, res, next) => {
    query_result = await Company.findByIdAndUpdate(req.params.id, req.body);
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

// GET /users/
// privilege: Admin
exports.getUsers = async (req, res, next) => {
    const query_result = await User.find({
        admin: false
    });
    return res.status(200).json({
        success: true,
        data: query_result
    });
}

// POST /users/:id
// privilege: Admin and LoggedInUser
exports.updateUser = async (req, res, next) => {
    try {
        const query_result = await User.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false
        })
    }

}

// PUT /users/
// privilege: Public
exports.createUser = async (req, res, next) => {
    try {
        const query_result = await User.create(req.body);
        return res.status(201).json({
            success: true,
            data: query_result
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false
        });
    }
}

// DEL /users/:id
// privilege: Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const query_result = await User.findById(req.params.id);
        query_result.remove();
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