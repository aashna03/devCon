const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const { userAuth } = require("../middlewares/auth.js");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join("$"))
        .digest("hex");
}

const initializeSocket = (server) =>{
    const io = socket(server,{
        cors: {
            origin: "http://localhost:5173",
        }
    });

    io.on("connection", (socket) => {
        //handle events
        socket.on("joinChat", ({userId, targetUserId}) => {
                // create a unique room name for the two users
                const roomId = getSecretRoomId(userId, targetUserId);
                // console.log(`T User ${targetUserId} S user ${userId} joined room ${roomId}`);
                socket.join(roomId);
        });

        socket.on("sendMessage", async({
            firstName, lastName, userId, targetUserId, newMessage
            }) => {
                
                try {   

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


                    const roomId = getSecretRoomId(userId, targetUserId);
                    console.log(`Message from ${firstName} to room ${roomId}: ${newMessage}`);
                
                    let chat = await Chat.findOne({
                        participants: {
                            $all: [userId, targetUserId]
                        }
                    })
                    if(!chat){
                        // create a new chat document if it doesn't exist
                        chat = new Chat({
                            participants: [userId, targetUserId],
                            messages: []
                        }); 
                    }
                    // append new message to the messages array of the chat document
                    chat.messages.push({
                        senderId: userId,
                        message: newMessage
                    })
                    // save in database
                    await chat.save();
                    // display the message to all users in the room
                    io.to(roomId).emit("messageReceived", {firstName, lastName, newMessage, date: new Date()});
                    
                } catch (err) {
                    console.error(`Error sending message: ${err.message}`);
                }
   
            });

        socket.on("disconnect", () => {});

    });
};

module.exports = initializeSocket;
