const express = require("express");

const app = express();


// one route can have many route handlers
// app.use(
//     "/user",
//     (req, res) => {
//         // Route Handler 1
//         console.log("Handling the route user 1"); 
//         res.send("Response 1") // postman this will be the response
//     },
//     (req, res) => {
//         // Route Handler 2
//         console.log("Handling the route user 2");
//         res.send("Response 2") // not this in this case
//     }
// )

// app.use(
//     "/user",
//     (req, res) => {
//         // Route Handler 1
//         console.log("Handling the route user 1");
//         // res.send("Response 1") if this is removed then the the reponse hangs as if no send is there and not go to the second handler
//     },
//     (req, res) => {
//         // Route Handler 2
//         console.log("Handling the route user 2");
//         res.send("Response 2")
//     }
// )

// app.use(
//     "/user",
//     (req, res, next) => {
//         // Route Handler 1
//         console.log("Handling the route user 1");
//         // res.send("Response 1")
//         next()
//     },
//     (req, res) => {
//         // Route Handler 2
//         console.log("Handling the route user 2");
//         res.send("Response 2") // now this will be printed!!!!!!!!!!!!!!
//     }
// )

// app.use(
//     "/user",
//     (req, res, next) => {
//         // Route Handler 1
//         console.log("Handling the route user 1");
//         res.send("Response 1") //////////////////////reponse1 will be returned as response
//         next()
//     },// js runs line by line this will also be executed
//     (req, res) => {
//         // Route Handler 2
//         console.log("Handling the route user 2"); /////console will be printed
//         res.send("Response 2") // this will throw error 
//     }
// )

// app.use(
//     "/user",
//     (req, res, next) => {
//         // Route Handler 1
//         console.log("Handling the route user 1");
//         next()
//         res.send("Response 1") // after next() is done this will be called but response is already done so ERROR
        
//     },// js runs line by line this will also be executed
//     (req, res) => {
//         // Route Handler 2
//         console.log("Handling the route user 2"); /////console will be printed
//         res.send("Response 2") //////////////////////reponse1 will be returned as response
//     }
// )

// app.use(
//     "/user",
//     (req, res, next) => {
//         // Route Handler 1
//         console.log("Handling the route user 1");
//         next()
        
//     },
//     (req, res, next) => {
//         // Route Handler 2
//         console.log("Handling the route user 2");
//         next()
        
//     },
//     (req, res, next) => {
//         // Route Handler 3
//         console.log("Handling the route user 3"); 
//         next()
//     }
// )
// here all logs will be printed in console without error -- in postman will get error - for express cannot get /user as for next it will expect another route handler as well

// app.use(
//     "/user",
//     (req, res, next) => {
//         // Route Handler 1
//         console.log("Handling the route user 1");
//         next()
        
//     },
//     (req, res, next) => {
//         // Route Handler 2
//         console.log("Handling the route user 2");
//         next()
        
//     },
//     (req, res) => {
//         // Route Handler 3
//         console.log("Handling the route user 3"); 
//         res.send("Response 3") // ths will work and return response 3
//     }
// )


// route handlers in array /// or /// partial route handlers in array
// app.use("/route", rH1, rH2, [rH3, rH4], rH5)
// app.use(
//     "/user",[
//         (req, res, next) => {
//             // Route Handler 1
//             console.log("Handling the route user 1");
//             next()
            
//         },
//         (req, res, next) => {
//             // Route Handler 2
//             console.log("Handling the route user 2");
//             next()
            
//         },
//         (req, res) => {
//             // Route Handler 3
//             console.log("Handling the route user 3"); 
//             res.send("Response 3") // ths will work and return response 3
//         }
//     ]
// )



// ==========================================================================
// as seq of the routes matter a lot - we can use independent routes and use next
app.use(
    "/user",
    (req, res, next) => {
        // Route Handler 1
        console.log("Handling the route user 1"); 
        next();
    }
)
app.use(
    "/user",
    (req, res) => {
        // Route Handler 2
        console.log("Handling the route user 2");
        res.send("Response 2") 
 
    }
)
app.listen(3000, () => {
    console.log("server running successfully");
    
});