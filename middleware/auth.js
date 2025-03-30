const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({message : "No token, authorization denied"});
        }

        console.log('Received Token:', token);  // Log the token

        try {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            console.log("SECRET_KEY:", process.env.SECRET_KEY);
            req.user = decode;
            console.log("The decoded user is: ", req.user);
            next();
        } catch (error) {
            res.status(400).json({message : 'Token is not valid'});
        }
    } else {
        return res.status(401).json({ message: "Authorization header is missing or invalid" });
    }
};

module.exports = {verifyToken}