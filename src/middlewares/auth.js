const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req, res, next) => {
    
    try{
        // get the token from cookie
        const { token } = req.cookies;
        if(!token){
            // throw new Error("Invalid Token")
            return res.status(401).send("Unauthorized Please Login");
        }
        const decodedMessage = jwt.verify(token, process.env.JWT_SECRET)

        const {_id} = decodedMessage;

        const user = await User.findById(_id);

        if(!user){
            throw new Error("User not found")  
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send(`Unauthorized request: ${error.message}`);
    }
}

module.exports = {
    userAuth
}