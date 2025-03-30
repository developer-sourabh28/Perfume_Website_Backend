const express = require('express');
const router = express.Router();

router.post('/logout', async(req, res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({message : 'Logout failed'})
        }
        res.clearCookie('connect.sid', {path: '/login'});
        res.status(200).json({message : 'Logout Success'})
        console.log('Logout Success')
    })
})

module.exports = router;