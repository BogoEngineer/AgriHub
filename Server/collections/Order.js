const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.ObjectId,
            ref: 'Company',
            required: true
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['delivered', 'travelling', 'on hold'],
            default: 'on hold'
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true
        },
        nursery: {
            type: mongoose.Schema.ObjectId,
            ref: 'Warehouse',
            required: true
        }
    },
    {
        versionKey: false
    }
);

var model = mongoose.model('Order', OrderSchema);
model.collection.name = 'Order';
module.exports = model;