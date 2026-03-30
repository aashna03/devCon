const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
// userAuth attaches the user object to the request if the token is valid and user is found in the database, otherwise it sends an error response and does not call next() so the control will not come to the API handler function and it will be stopped at the middleware itself. So we can directly use req.user in our API handler function without worrying about whether it is there or not because if it is not there then the control will not come to the API handler function.
// (req.user) to get the whole user object
const { validateEditProfileData } = require("../utils/validation.js");
const validator = require("validator");
const bcrypt = require("bcrypt")

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

// password profile API
profileRouter.get("/profile/password-change", userAuth, async(req, res) =>{
    try {
        const newPasswordInput = req.body.newPassword;
        const reenteredPasswordInput = req.body.reenteredPassword;
        if(newPasswordInput != reenteredPasswordInput){
            throw new Error("The new password and the re-entered password doesnot match");
        }
        if(!validator.isStrongPassword(newPasswordInput)){
            throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
        }
        const hashedPassword = await bcrypt.hash(newPasswordInput, 10);
        const loggedInUser = req.user;
        loggedInUser.password = hashedPassword;
        await loggedInUser.save();
        res.json({
            "message":"password updated"
        });


    } catch (err) {
        res.status(401).send(`Error : ${err}`)
    }
})


module.exports = profileRouter;