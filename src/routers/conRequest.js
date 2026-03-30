const express = require("express");
const conRequestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js")
const User = require("../models/user.js");

conRequestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) => {
    try{
        const { status, toUserId } = req.params;
        const fromUserId = req.user._id;

        // this api will only handle interested or ignored and not accepted and rejected
        const acceptedStatus = ["interested", "ignored"];
        if(!acceptedStatus.includes(status)){
            throw new Error("Invalid Status");  
        }

        // donot send connect request to itself -- handled in pre

        // if toUserId is not present in User database send error   
        const isToUserIdPresent = await User.findById(toUserId);
        if(!isToUserIdPresent){
            throw new Error("toUserId is not valid");
        }

        // at a time the status between the 2 ids can be 1 only and not both and also multiple hits on api should only update the database not create new documents
        // what if a send connection to b then again b sends to a
        // // // a -> b in db
        // // // check for pendingRequest b -> a, or existingRequest a-> b already there in db

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: fromUserId, toUserId: toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existingRequest){
            throw new Error("Connection request already exists between the users, cannot send multiple requests")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        await connectionRequest.save();

        res.send(`Request: ${status} \n sent from ${req.user.firstName} to ${isToUserIdPresent.firstName}`);
    }catch(err){
        res
          .status(400)
          .json({
            message: `Error: ${err.message}`
          });
    }
})

conRequestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {

    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user;

        // check if status is valid
        const acceptedStatus = ["accepted", "rejected"];
        if(!acceptedStatus.includes(status)){
            throw new Error("Invalid Status");
        }

        // suppose Aashna ==> Elon
        // loggedInUser = Elon who can accept or reject the request
        // check if requestId is valid
        // if in the database we have a document with {requestId, status as interested, toUserId as loggedIn user}
        const conRequest = await ConnectionRequest.findOne({
            _id : requestId,
            status : "interested",
            toUserId : loggedInUser._id 
        });

        if(!conRequest){
            throw new Error("The request is not valid");   
        }

        // loggedInUser.status = status;
        conRequest.status = status;
        await conRequest.save();
        
        res.json({
            message: `Request ${status} successfully`
        })


        
    } catch (err) {
        res.status(400).json({
            message: `Error: ${err.message}`
        });
    }


})


module.exports = conRequestRouter;