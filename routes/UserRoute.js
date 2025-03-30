const express = require('express');
const User = require('../schemas/UserSchema');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async(req, res) => {
    try {
        const newUser = new User({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
        })

        const savedUser = await newUser.save();
        res.status(200).json({message : 'User Signup success!'})
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const loginUser = await User.findOne({ email });

        if (!loginUser) {
            return res.status(404).json({ message: "User not found" }); // ✅ Return immediately
        }

        // Compare passwords (bcrypt.compare)
        const isMatch = await bcrypt.compare(password, loginUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token with username
        const token = jwt.sign(
            {
                id: loginUser._id,
                username: loginUser.name,  // ✅ Fix: Add username in token
                role: loginUser.role
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        console.log("Generated Token:", token);  // ✅ Debugging: Print token

        res.status(200).json({ token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;