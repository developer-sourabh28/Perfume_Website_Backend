const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    group: {
        type: String,
        enum: ['bestseller', 'crazydeals'],
        require: true,
    },
    productType: {
        type: String,
        enum: ['male', 'female', 'unisex'],
        required: true,
    },
    size: {
        type: String,
        enum: ['small', 'medium', 'large'],
        required: true,
    },
    image: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Post', postSchema);


