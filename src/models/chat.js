const mongoose = require("mongoose");

const messageschema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    }

}, { timestamps: true });

const chatschema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [messageschema],

});

const Chat = mongoose.model("Chat", chatschema);

module.exports = { Chat };