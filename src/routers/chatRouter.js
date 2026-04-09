const express = require("express");
const { Chat } = require("../models/chat.js");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest.js");

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId',userAuth, async(req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user._id;

        if(targetUserId.toString().length > 100 || userId == targetUserId){
            throw new Error("The Request is not valid");
        }
        // // if toUserId is not present in User database send error   
        // const istargetUserIdPresent = await User.findById(targetUserId);
        // if(!istargetUserIdPresent){
        //     throw new Error("UserId is not valid");
        // }

        const conRequest = await ConnectionRequest.findOne(
            {
            status : "accepted",
            toUserId : {$in: [userId, targetUserId]},
            fromUserId : {$in: [userId, targetUserId]}
            }
        );

        if(!conRequest){
            throw new Error("The request is not valid");   
        }

        let chat = await Chat.findOne({
            participants: {
                $all: [userId, targetUserId]
            }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        });
        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            })
            await chat.save();
        }
        res.json({
            data: chat
        })


    } catch (err) {
        res.status(400).json({
            message: `Error: ${err.message}`
        });
    }
})



module.exports = chatRouter;