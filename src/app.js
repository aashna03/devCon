const express = require("express");
// create express app
const app = express();
// const bcrypt = require("bcrypt"); // for /login API and /signup API
const cookieParser = require("cookie-parser");
require('dotenv').config();
const {connectDB} =  require("./config/database.js")
// const User = require("./models/user");
// const { validateSignUpData } = require("./utils/validation.js");  //  for /signup API
// const jwt = require("jsonwebtoken"); // for generating JWT token in /login API
// const { userAuth } = require("./middlewares/auth.js"); // everytime we are hiiting any API when we are logged in

// this is a middleware which will be activated for all the routes
// to covert json incoming coverts it into JS object and adds it into the request body again
app.use(express.json());
// middleware to parse cookies
app.use(cookieParser());

const authRouter = require("./routers/auth.js");
const profileRouter = require("./routers/profile.js");
const conRequestRouter = require("./routers/conRequest.js");
const userRouter = require("./routers/user.js");


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', conRequestRouter);
app.use('/', userRouter);


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



