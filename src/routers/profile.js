const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
// userAuth attaches the user object to the request if the token is valid and user is found in the database, otherwise it sends an error response and does not call next() so the control will not come to the API handler function and it will be stopped at the middleware itself. So we can directly use req.user in our API handler function without worrying about whether it is there or not because if it is not there then the control will not come to the API handler function.
// (req.user) to get the whole user object

// profile API
profileRouter.get("/profile", userAuth, async(req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(401).send(`Error: ${err.message}`)
    }
})

module.exports = profileRouter;