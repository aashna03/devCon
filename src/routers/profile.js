const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
// userAuth attaches the user object to the request if the token is valid and user is found in the database, otherwise it sends an error response and does not call next() so the control will not come to the API handler function and it will be stopped at the middleware itself. So we can directly use req.user in our API handler function without worrying about whether it is there or not because if it is not there then the control will not come to the API handler function.
// (req.user) to get the whole user object
const { validateEditProfileData } = require("../utils/validation.js");

// view p+rofile API
profileRouter.get("/profile/view", userAuth, async(req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(401).send(`Error: ${err.message}`)
    }
})

// edit profile API
profileRouter.get("/profile/edit", userAuth, async(req, res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid data for profile update");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((body_field) => (loggedInUser[body_field] = req.body[body_field]));
        console.log(loggedInUser);
        await loggedInUser.save();
        // res.send("Profile updated successfully");
        // or
        res.json({
            message: "Profile updated successfully",
            data: loggedInUser
        })
        
    } catch (err) {
        res.status(401).send(`Error: ${err.message}`)
    }
})

module.exports = profileRouter;