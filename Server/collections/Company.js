const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true
        },
        short_name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        date_of_founding: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        approved: {
            type: Boolean,
            default: false
        },
        postman: {
            type: Number,
            default: 5,
            enum: [0, 1, 2, 3 , 4, 5]
        }
    },
    {
        versionKey: false
    }
);

// Deleting all of the products when company is deleted
CompanySchema.pre('remove', async function(next){
    await this.model('Product').deleteMany({user: this._id});
    next();
});

var model = mongoose.model('Company', CompanySchema);
model.collection.name = 'Company';
module.exports = model;