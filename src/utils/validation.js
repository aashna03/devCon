const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if(!firstName){
        console.log("firstName" +  firstName);
        
        throw new Error("First name is required");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid email address");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }
};

module.exports = {
    validateSignUpData,
}