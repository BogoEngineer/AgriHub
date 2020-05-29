const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        date_of_birth: {
            type: Date,
            required: true
        },
        place_of_birth: {
            type: String,
            required: true
        },
        phone: {
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
        admin: {
            type: Boolean,
            default: false
        }
    },
    {
        versionKey: false,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

// Deleting all of the nurseries when user is deleted
UserSchema.pre('remove', async function(next){
    await this.model('Nursery').deleteMany({user: this._id});
    next();
});

// Reverse populating
UserSchema.virtual('nurseries',
{
    ref: 'Nursery',
    localField: '_id',
    foreignField: 'user',
    justOne: false
}
);

var model = mongoose.model('User', UserSchema);
model.collection.name = 'User';
module.exports = model;