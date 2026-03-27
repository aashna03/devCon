const express = require("express");
require('dotenv').config();

const {connectDB} =  require("./config/database.js")
const app = express();

const User = require("./models/user");

// this is a middleware which will be activated for all the routes
// to covert json incoming coverts it into JS object and adds it into the request body again
app.use(express.json());

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

    const user = new User(req.body)

    try{
        // save data in database
        await user.save();
        res.send("User added successfully")
    } catch(err){
        res.status(400).send(`Error saving the  user ${err.message}`)
    }

})

// get user by email
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

// Feed API - GET/feed - get all users from the database
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
app.patch("/user", async(req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try{
        await User.findByIdAndUpdate({ _id: userId}, data);
        res.send("User updated successfully")
    }catch(err){
        res.status(400).send("Something went wrong")
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


