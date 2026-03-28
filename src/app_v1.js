const express = require("express");
// create express app
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const {connectDB} =  require("./config/database.js")
const User = require("./models/user.js");
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
    // this is JS object
    // const userObj = {
    //     firstName: "Aashna",
    //     lastName: "Agarwal",
    //     emailId:"aashna@agarwal.com",
    //     password: "aashna@a6"
    // }
    // // creating a new instance of User model -- create new user with the above data 
    // const user = new User(userObj);

    // const user = new User({
    //     firstName: "Aashna",
    //     lastName: "Agarwal",
    //     emailId:"aashna@agarwal.com",
    //     password: "aashna@a6"
    // })
    

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
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).send("Invalid credentials");
        }
        // password is correct  
        // create a JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // console.log(token);

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
        // const cookies = req.cookies;
        // // console.log(cookies);
        // const { token } = cookies;
        // if(!token){
        //     throw new Error("Invalid Token")
        // }
        // // validate the token
        // const decodedMessage = jwt.verify(token, process.env.JWT_SECRET)
        // const {_id} = decodedMessage;
        // // console.log(_id)
        // const user = await User.findById(_id);
        // if(!user){
        //     throw new Error("User not found")
        // }
        // res.send(user)

        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(401).send(`Error:  ${err.message}`)
    }
})


// dummy - get user by email
app.get("/user", async(req, res) => {
    const userEmail = req.body.emailId;

    try{
        // get user by email
        const user = await User.find({ emailId: userEmail })
        if(user.length === 0){
            res.status(404).send("User Not Found")
        }
        res.send(user)

    }catch(err){
        res.status(400).send("Something went wrong")
    }
})

// dummy - Feed API - GET/feed - get all users from the database

app.get("/feed", async(req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }
    catch(err){
        res.status(400).send("Something went wrong")
    }
})

// delete user by id
app.delete("/user", async(req, res) => {
    const userId = req.body.userId;
    try{
        // const user = await User.findByIdAndDelete({ _id: userId });
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted Successfully")
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})


// update user of the user
app.patch("/user/:userId", async(req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    console.log(userId);
    

    try{
        const ALLOWED_UPDATES = [
            "skills", "photoUrl", "about", "gender", "age"
        ];
        const isUpdateAllowed = Object.keys(data).every((key) => 
            ALLOWED_UPDATES.includes(key)
        )
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        if(data?.skills?.length > 10){
            console.log("skills addition");
            
            throw new Error("Skills cannot be more than 10")
        }
        await User.findByIdAndUpdate({ _id: userId}, data, {
            returnDocument: "after",
            runValidators: true
        });
        res.send("User updated successfully")
    }catch(err){
        res.status(400).send(`Something went wrong ${err}`)
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


