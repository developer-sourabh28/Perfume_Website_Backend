const express = require('express');
const router = express.Router();
const Card = require('../schemas/CardSchema');
const upload = require('../configure/images');

router.post('/api/cards', upload.single('image'), async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({message : 'No image file uploaded'})
        }

        const {name, description, profile} = req.body;

        if(!name || !description || !profile){
            return res.status(400).json({message : 'All fields are required'})
        }

        const image = req.file ? req.file.path : null;

        const newCard = new Card({
            name, description, profile, image
        })
        await newCard.save();

        res.status(200).json({message : 'Post addess successfully', card : newCard});
    } catch (error) {
        res.status(500).json({message : 'Something went wrong', error : error.message})
    }
});

router.get('/card', async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({error : 'Failed to fetch posts'})
    }
})

module.exports = router;