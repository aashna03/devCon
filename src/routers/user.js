const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js"); 
const ConnectionRequest = require("../models/connectionRequest.js");

userRouter.get('/user/requests/received', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const receivedRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate('fromUserId', 'firstName lastName profileUrl'); // populate fromUserId to get sender's details

        res.json({
            message: "Received connection requests fetched successfully",
            data: receivedRequests
        })
        
    } catch (err) {
        res.status(400).json({
            message: `Error: ${err.message}`
        })
    }
})






module.exports = userRouter;