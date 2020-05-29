const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
    {
        first_name:{
            type: String,
            required: false
        },
        type: {
            type: String,
            enum: ['user', 'company'],
            required: true
        },
        last_name: {
            type: String,
            required: false
        },
        username: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: true
        },
        date_of_birth: {
            type: Date,
            required: false
        },
        place_of_birth: {
            type: String,
            required: false
        }, 
        phone: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true
        },
        full_name: {
            type: String,
            required: false
        },
        abbreviation: {
            type: String,
            required: false
        },
        founding_date: {
            type: Date,
            required: false
        },
        place: {
            type: String,
            required: false
        }
    },
    {
        versionKey: false
    }
);

var model = mongoose.model('Request', RequestSchema);
model.collection.name = 'Request';
module.exports = model;