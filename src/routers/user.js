const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js"); 
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user");

const USER_SAFE_FIELDS = "firstName lastName photoURL age gender about skills";

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
        res
            .json({
                message: "Connections fetched successfully",
                data: data
            })
    }
    catch(err){
        res
            .status(400)
            .json({
                message: `Error: ${err.message}`
            })
    }
})

userRouter.get('/feed', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        // for pagination we can use skip and limit
        const skip = parseInt(req.query.page) || 0; // default value is 0
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));; // default value is 10

        const connections = await ConnectionRequest.find({
            $or:[
                { fromUserId:loggedInUser._id }, { toUserId: loggedInUser._id }
            ]
        })
        .select('fromUserId toUserId');

        const hiddedUserIds = new Set();
        connections.forEach((connection) =>{
            hiddedUserIds.add(connection.fromUserId.toString());
            hiddedUserIds.add(connection.toUserId.toString());
        })
        // console.log("hiddenUserIds: ", hiddedUserIds);
        const feed_users = await User.find({
            $and:[
                { _id: { $nin : [...hiddedUserIds]}}, //  set to array using spread operator
                // { _id: { $nin : Array.from(hiddedUserIds) } }, // $nin means not in
                { _id: { $ne: loggedInUser._id } } // $ne means not equal to
            ]
        }).select(USER_SAFE_FIELDS)
          .skip(skip)
          .limit(limit);
        // console.log("feed_users: ", feed_users);

        res
            .json({
                message: "User feed fetched successfully!!!!",
                data: feed_users
            })

        
    } catch (err) {
        res
            .status(400)
            .json({
                message: `Error: ${err.message}`
            })
    }
})



module.exports = userRouter;