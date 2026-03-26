const express = require("express");
require('dotenv').config();

const {connectDB} =  require("./config/database.js")
const app = express();

const User = require("./models/user");

app.post("/signup", async(req, res) => {

    // const userObj = {
    //     firstName: "Aashna",
    //     lastName: "Agarwal",
    //     emailId:"aashna@agarwal.com",
    //     password: "aashna@a6"
    // }
    // // creating a new instance of User model -- create new user with the above data 
    // const user = new User(userObj);

    const user = new User({
        firstName: "Aashna",
        lastName: "Agarwal",
        emailId:"aashna@agarwal.com",
        password: "aashna@a6"
    })

    try{
        // save data in database
        await user.save();
        res.send("User added successfully")
    } catch(err){
        res.status(400).send(`Error saving the  user ${err.message}`)
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


