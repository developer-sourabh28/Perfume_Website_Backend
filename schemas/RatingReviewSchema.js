const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
});

const reviewSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: String,
    comment: String,
    timestamp: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', ratingSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { Rating, Review };
