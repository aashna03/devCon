const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { validateSignUpData } = require("../utils/validation.js");
const { userAuth } = require("../middlewares/auth.js");

// signup API 
authRouter.post("/signup", async(req, res) => {  
    try{
        // Validation of the incoming data
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        
        // Encrypt the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        // creating new user instance with the incoming data
        const user = new User({
            firstName, 
            lastName, 
            emailId, 
            password: hashedPassword
        })
        // save data in database
        await user.save();
        res.send("User added successfully")
    } catch(err){
        res.status(400).send(`Error:  ${err.message}`)
    }
})

// login API
authRouter.post("/login", async(req, res) => {
    try{
        const { emailId, password } = req.body;
        // find user by email id
        const user = await User.findOne({ emailId: emailId });
        // if user is not found with the given email id then send 404 response
        if(!user){
            // never use email not in db as it can be used for enumeration attack - it is like exposing extra info, instead use invalid credentials
            return res.status(404).send("Invalid credentials");
        } 
        // compare the password with the hashed password stored in the database  
        // const isPasswordMatch = await bcrypt.compare(password, user.password);
        const isPasswordMatch = await user.validatePassword(password);
        if(!isPasswordMatch){
            return res.status(400).send("Invalid credentials");
        }
        // password is correct  
        // create a JWT token
        // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // offloaded the token generation logic to the model method in user.js sechma methods
        const token = await user.getJWT();
        // Add the token to cookie and send response back to user
        res.cookie("token", token)

        res.send("Login successful");
    } catch(err){
        res.status(400).send(`Error:  ${err.message}`)
    }
})

module.exports = authRouter;