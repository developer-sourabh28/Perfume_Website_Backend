const express = require('express');
const router = express.Router();
const Cart = require('../schemas/cartSchema');
const Item = require('../schemas/postSchema');
const {verifyToken} = require('../middleware/auth');
const { default: mongoose } = require('mongoose');

router.post('/cart/add', verifyToken, async (req, res) => {
    try {
        const { userId, itemId, itemName, itemPrice, itemSize, itemType } = req.body;

        if (!userId || !itemId || !itemName || !itemPrice || !itemSize || !itemType) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newCartItem = new Cart({
            userId,
            itemId,
            itemName,
            itemPrice,
            itemSize,
            itemType
        });

        await newCartItem.save();

        res.status(201).json({ message: 'Item added to cart successfully', newCartItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/cart/:userId', async(req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);

        const cart = await Cart.find({userId});
        if(!cart){
            return res.status(404).json({message : 'Cart not found'});
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({message : 'Server error'});
    }
})

router.delete('/cart/:id', async(req, res) => {
    try {
        console.log(req.params.id);
        const deleteCart = await Cart.findByIdAndDelete(req.params.id);

        if(!deleteCart){
            return res.status(404).json({message : 'Cart item not found'})
        }
        res.status(200).json({message : 'Item deleted successfully !'})
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

module.exports = router;