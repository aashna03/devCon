const adminAuth = (req, res, next) => {
    console.log("Inside adminAuth");
    const token = "token_from_user";
    const isAdminAuthorised = "token_to_unlock" === "token_to_unlock";
    if(!isAdminAuthorised){
        res.status(401).send("Unauthorized request");
    }
    else{
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log("Inside userAuth");
    
    const token = "token_from_user";
    const isAdminAuthorised = "token_to_unlock" === "token_to_unlock";
    if(!isAdminAuthorised){
        res.status(401).send("Unauthorized request");
    }
    else{
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}