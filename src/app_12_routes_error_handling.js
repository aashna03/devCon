const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth.js")

// sequence matters
// middleware for all admin routes except /user/login
app.get("/admin/login", (req, res) => {
    res.send("Logged in user");
})

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
    res.send("User Data Sent")
})

app.get("/admin/getAllData", (req, res) => {
    res.send("All Data Sent");
})

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleted a user");
})



app.get("/adminlogin", (req, res) => {
    throw new Error("pgufgvbnjouhiyguvb")
    res.send("User Logged in");
})

app.get("/userlogin", (req, res) => {
    try{
        throw new Error("pgufgvbnjouhiyguvb")
        res.send("User Logged in");
    }
    catch(err){
        res.status(500).send("Some error contact support team")
    }
})

// error handling ... this is also known as middleware --- use try catcha 
app.use("/", (err, req, res, next) => {
    if(err){
        // log your error
        res.status(500).send("something went wrong");
    }
})



app.listen(3000, () => {
    console.log("server running successfully");
});