const express = require("express");

const app = express();

app.use("/admin", (req, res, next) => {
    const token = "token_from_user";
    const isAdminAuthorised = "token_to_unlock" === "token_to_unlock";
    if(!isAdminAuthorised){
        res.status(401).send("Unauthorized request");
    }
    else{
        next();
    }
})

app.get("/admin/getAllData", (req, res) => {
    res.send("All Data Sent");
})

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleted a user");
})




app.listen(3000, () => {
    console.log("server running successfully");
    
});