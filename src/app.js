const express = require("express");

const app = express();

// request handler
// route, (req, res), ()=>{}
app.use("/test", (req, res) => {
    res.send("Hello from test endpoint!!!!")
})

app.use("/", (req, res) => {
    res.send("Hello from dashboard")
})

app.listen(3000, () => {
    console.log("server running successfully");
    
});