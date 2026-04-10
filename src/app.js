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
// const { userAuth } = require("./middlewares/auth.js"); // everytime we are hitting any API when we are logged in
const http = require("http")

// to allow cross-origin requests from frontend (React app)
const cors = require("cors");
const allowedOrigins = [
    "https://dev-con-web.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow server-to-server calls and same-origin requests without Origin header.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true, // Allow cookies to be sent with requests
    })
);
// this is a middleware which will be activated for all the routes
// to covert json incoming coverts it into JS object and adds it into the request body again
app.use(express.json());
// middleware to parse cookies
app.use(cookieParser());


const authRouter = require("./routers/auth.js");
const profileRouter = require("./routers/profile.js");
const conRequestRouter = require("./routers/conRequest.js");
const userRouter = require("./routers/user.js");
const chatRouter = require("./routers/chatRouter.js");
const initializeSocket = require("./utils/socket.js");
const { prototype } = require("events");


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', conRequestRouter);
app.use('/', userRouter);
app.use('/', chatRouter);


const server = http.createServer(app);
initializeSocket(server);

connectDB()
    .then(() => {
        console.log("Database connection established");
        // we should connect to db then start listening
        const PORT = process.env.PORT || 10000;
        // server.listen(PORT, () => {
        //     console.log("server running successfully");
        // });
        app.listen(PORT, '0.0.0.0');

    })
    .catch((err) => {
        console.error("Database cannot be connected");
    })



