const express = require('express');
const router = express.Router();
const {Rating, Review} = require('../schemas/RatingReviewSchema');
const {verifyToken} = require('../middleware/auth');
const Post = require('../schemas/postSchema');

router.post("/comment/:id", verifyToken, async (req, res) => {
    try {
        console.log("Received product ID:", req.params.id);
        console.log("Request body:", req.body); // Log the request body
        console.log("Headers:", req.headers); // Log headers

        const { userId, username, comment } = req.body;
        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is missing" });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        // Create a new review
        const newReview = new Review({
            postId: productId,
            userId,
            username,
            comment
        });

        await newReview.save();

        res.json({ message: "Comment added", review: newReview });
    } catch (error) {
        console.error("Error submitting comment:", error);
        res.status(500).json({ message: error.message });
    }
});


router.get('/comment/:id', async (req, res) => {
    try {
        console.log("Fetching comments for post ID:", req.params.id);

        const postId = req.params.id;

        if (!postId) {
            return res.status(400).json({ message: "Post ID is missing!" });
        }

        // 🛠️ Fetch all reviews related to the post
        const reviews = await Review.find({ postId });

        res.json({ comments : reviews });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/comment/:id', verifyToken, async (req, res) => {
    try {
        // console.log("deleting comments for post ID:", req.params.id);

        const postId = req.params.id;

        // if (!postId) {
        //     return res.status(400).json({ message: "Post ID is missing!" });
        // }

        // 🛠️ Fetch all reviews related to the post
        const deleteReviews = await Review.findByIdAndDelete(postId);

        if(!deleteReviews){
            return res.status(404).json({message : "Reveiw not found"});
        }
        res.status(200).json({message : "Review deleted success"})
    } catch (error) {
        console.error("Error deleting comments:", error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;