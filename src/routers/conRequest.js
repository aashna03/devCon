const express = require("express");
const conRequestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

conRequestRouter.post("/sendConnectionRequest", userAuth, async(req, res) => {
    const user = req.user;

    // Sending a connection request
    console.log("// Sending a connection request")
    
    res.send(`${user.firstName} ${user.lastName} sent a connection request`)
})


module.exports = conRequestRouter;