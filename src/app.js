const express = require("express");

const app = express();

// this will overwrite other /....
// app.use("/", (req, res) => {
//     res.send("Hello from dashboard")
// })

// request handler
// route, (req, res), ()=>{}
// anything "/test/dfsdfsdbsa/fgfd" matches here not "/test3456" donot matches kindof wildcard
app.use("/test", (req, res) => {
    res.send("Hello from test endpoint!!!!")
})

// this works as sequence matters
app.use("/", (req, res) => {
    res.send("Hello from dashboard")
})

app.listen(3000, () => {
    console.log("server running successfully");
    
});