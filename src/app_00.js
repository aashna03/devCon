const express = require("express");

const app = express();

// // Advance Routing Technique using RegEx
// // * + ? ------------ here * is for wild card any string is valid
// app.get("/ab*cd", (req, res) => {
//     res.send({firstname: "ab", lastname: "cd"})
// })

// // if in the path a letter is there
// app.get(/a/, (req, res) => {
//     res.send({path1: "cab", path2: "a"})
// })

// this will overwrite other /....
// app.use("/", (req, res) => {
//     res.send("Hello from dashboard")
// })

// // sequence matter
// // if use is used before get, post, or any other - it overwrite other functions if written before
// app.use("/user", (req, res) => {
//     res.send("see the overwriting here by method 'use'")
// })

app.get("/users/:userId/:name/:password", (req, res) => {
    
    // API call >>> http://localhost:3000/users/707/Aashna/password123
    console.log(req.params);
    // output : [Object: null prototype] {
        //   userId: '707',
        //   name: 'Aashna',
        //   password: 'password123'
        // }
    res.send({firstname: "Aashna2", lastname: "Agarwal2"})

})

//  : means dynamic route
app.get("/user/:userId", (req, res) => {

    // get params in the API 
    // for API =====> http://localhost:3000/user/707
    console.log(req.params);
    // output ===> [Object: null prototype] { userId: '707' }
    
    res.send({firstname: "Aashna1", lastname: "Agarwal1"})
});

// by default browser has get request
// This will only handle GET call to /user
app.get("/user", (req, res) => {
    
    // supppose http://localhost:3000/user?userID=101&password=testing
    console.log(req.query);
    // output ;;;; [Object: null prototype] { userID: '101', password: 'testing' }
    res.send({firstname: "Aashna", lastname: "Agarwal"})

});

// save data to DB
app.post("/user", (req, res) => {
    res.send("Data successfuully saved to the database")
});

app.delete("/user", (req, res) => {
    res.send("Deleted successfully")
})


// request handler
// route, (req, res), ()=>{}
// anything "/test/dfsdfsdbsa/fgfd" matches here not "/test3456" donot matches kindof wildcard
// this will match all HTTP method API calls to /test - GET, POST
app.use("/test", (req, res) => {
    res.send("Hello from test endpoint!!!!")
})

// // this works as sequence matters
// app.use("/", (req, res) => {
//     res.send("Hello from dashboard")
// })

app.listen(3000, () => {
    console.log("server running successfully");
    
});