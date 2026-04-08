const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = ({userId, targetUserId}) => {
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
        socket.on("joinChat", (userId, targetUserId) => {
                // create a unique room name for the two users
                const roomId = getSecretRoomId({userId, targetUserId});
                socket.join(roomId);
                console.log(`User ${targetUserId} joined room ${roomId}`);
        });

        socket.on("sendMessage", ({
            firstName, lastName, userId, targetUserId, newMessage
            }) => {
                const roomId = getSecretRoomId({userId, targetUserId});
                console.log(`Message from ${firstName} to room ${roomId}: ${newMessage}`);
                io.to(roomId).emit("messageReceived", {firstName, newMessage})
            });

        socket.on("disconnect", () => {});

    });
};

module.exports = initializeSocket;
