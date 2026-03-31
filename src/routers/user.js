const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js"); 
const ConnectionRequest = require("../models/connectionRequest.js");

const USER_SAFE_FIELDS = "firstName lastName profileUrl age gender about skills";

userRouter.get('/user/requests/received', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const receivedRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate('fromUserId', USER_SAFE_FIELDS);

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

userRouter.get('/user/connections', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        // status: accepted
        // Elon => Aashna (loggedInUser is toUserId) 
        // Aashna => Sundar (loggedInUser is fromUserId)
        // for both we need to check
        const conReq = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate('fromUserId toUserId', USER_SAFE_FIELDS); // populate both fromUserId and toUserId to get details of both users
        

        // conReq is an array of connection request documents
        //  array.map(...) runs once for each item in that array and creates a new array from the returned values.
        // take row meaing as each connection request document 
        const data = conReq.map((row) => {
            const isSender = row.fromUserId._id.equals(loggedInUser._id);
            return isSender ? row.toUserId : row.fromUserId;
        });
        res.json({
            message: "Connections fetched successfully",
            data: data
        })
    }
    catch(err){
        res.status(400).json({
            message: `Error: ${err.message}`
        })
    }
})





module.exports = userRouter;