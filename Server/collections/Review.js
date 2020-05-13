const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            enum: [0, 1, 2, 3, 4, 5]
        },
        product: {
            type: String,
            required: true
        },
        company: {
            type: mongoose.Schema.ObjectId,
            ref: 'Company',
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        exist: {
            type: Boolean,
            default: false
        }
    },
    {
        versionKey: false
    }
);

ReviewSchema.statics.getAverageRating = async function(name, company) {
    try{
        const aggregation = await this.aggregate([
            {$match: {product: name, company: mongoose.Types.ObjectId(company)}},
            {$group: {_id:{name:"$name", company:"$company"}, averageRating: {$avg: "$rating"}}},
            {$project: {_id:0, name:"$_id.name", company:"$_id.company", averageRating: "$averageRating"}}
        ]);
        return aggregation;
    }catch(err){
        console.log(err);
    }
    return null
}

var model = mongoose.model('Review', ReviewSchema);
model.collection.name = 'Review';
module.exports = model;