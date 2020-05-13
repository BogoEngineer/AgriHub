const mongoose = require('mongoose');

const NurserySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        water: {
            type: Number,
            default: 200,
            min: 0,
            max: 400
        },
        temperature: {
            type: Number,
            default: 18,
            min: 0,
            max: 30
        },
        width: {
            type: Number,
            required: true
        },
        height:{
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        num_of_seedlings: {
            type: Number,
            default: 0
        }
    },
    {
        versionKey: false
    }
);

var model = mongoose.model('Nursery', NurserySchema);
model.collection.name = 'Nursery';
module.exports = model;