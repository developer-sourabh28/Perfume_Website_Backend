const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth');
const veriFyRole = require('../middleware/role');

//only admin can access this route
router.get('/admin', verifyToken, veriFyRole("admin"), (req, res) => {
    res.json({message : "Welcome Admin"})
});

//both admin and user can this route
router.get('/user', verifyToken, veriFyRole("admin", "user"), (req, res) => {
    res.json({message : "Welcome User"})
});
module.exports = router;