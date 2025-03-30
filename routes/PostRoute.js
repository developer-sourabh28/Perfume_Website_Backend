const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2
const Post = require('../schemas/postSchema');
const upload = require('../configure/images'); // Multer middleware for image upload
const User = require('../schemas/UserSchema'); // User schema to check roles
const RatingReview = require('../schemas/RatingReviewSchema');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = multer.memoryStorage();
const uploads = multer({storage});


// Route to add a new post
router.post('/api/uploads', verifyToken, uploads.single('image'), async (req, res) => {
    try {
        // Check if image is present
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        // const fileUrl = `/uploads/${req.file.filename}`; // Assuming the `uploads` directory is served statically
        // res.status(200).json({ message: 'File uploaded successfully', fileUrl });

        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'eCommerce'
        });

        // Extract post details from the request body
        const { name, description, productType, size, price, group } = req.body;

        // Ensure all required fields are provided
        if (!name || !description || !productType || !size || !price || !group) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (isNaN(price)) {
            return res.status(400).json({ message: 'Price must be a valid number' });
        }

        // Handle image upload
        // const image = req.file ? req.file.path : null;

        // Create a new post
        const newPost = new Post({
            name,
            description,
            size,
            price,
            group,
            productType,
            image : cloudinaryResult.secure_url,
            createdBy: user._id, // Attach admin ID
        });

        // Save the post to the database
        await newPost.save();

        // Return success response
        res.status(200).json({ message: 'Post added successfully!', post: newPost });
    } catch (error) {
        // Handle server errors
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});


router.get('/post', async (req, res) => {
    try {
        const posts = await Post.find(); // Replace with your database logic
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

router.delete('/post/delete/:id', async (req, res) => {
   try {
    const deletePost = await Post.findByIdAndDelete(req.params.id);
    
    if(!deletePost){
        return res.status(404).json({message : 'Post not found'})
    }
     res.status(200).json({message : 'Post deleted successfully'})
   } catch (error) {
    res.status(500).json({message : error.message});
   }
})

module.exports = router;
