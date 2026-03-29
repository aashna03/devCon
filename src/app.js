const express = require("express");
// create express app
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const {connectDB} =  require("./config/database.js")
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation.js");  
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

// this is a middleware which will be activated for all the routes
// to covert json incoming coverts it into JS object and adds it into the request body again
app.use(express.json());
// middleware to parse cookies
app.use(cookieParser());

// signup API 
app.post("/signup", async(req, res) => {  
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
app.post("/login", async(req, res) => {
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

// profile API
app.get("/profile", userAuth, async(req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(401).send(`Error: ${err.message}`)
    }
})


connectDB()
    .then(() => {
        console.log("Database connection established");
        // we should connect to db then start listening
        app.listen(3000, () => {
            console.log("server running successfully");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected");
    })


