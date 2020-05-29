const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true
        },
        abbreviation: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        founding_date: {
            type: Date,
            required: true,
        },
        place: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
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