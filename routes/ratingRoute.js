const express = require('express');
const router = express.Router();
const {Rating, Review} = require('../schemas/RatingReviewSchema');
const {verifyToken} = require('../middleware/auth')

router.post("/rate/:id", verifyToken, async (req, res) => {
    // const {productId} = req.params._id;
     
    try {
        const {userId, rating} = req.body;
        const productId = req.params.id;

        if(!rating || rating < 1 || rating > 5){
            return res.status(400).json({message : "Rating must be between 1 and 5."})
        }

        const product = await Rating.findById(productId);

        if(!product) return res.status(404).json({message : "product not found"});

        const existingRating = product.ratings.find(r => r.userId.toString() === userId);

        if(existingRating){
            existingRating.rating = rating;
        }else{
            product.ratings.push({userId, rating});
        }
        await product.save();
        res.json({message : 'Rating updated', product})
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});

router.get("/rating/:ProductId", verifyToken, async (req, res) => {
    const {productId} = req.params;

    try {
        const product = await Rating.findById(productId);
        if(!product) return res.status(404).json({message : 'Product not found'});

        const totalRating = product.ratings.length;

        const avgRating = totalRating
        ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRating
        : 0;

        res.json({averageRating : avgRating.toFixed(1), totalRating});
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});

module.exports = router;