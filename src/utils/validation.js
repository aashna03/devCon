const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if(!firstName){        
        throw new Error("First name is required");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid email address");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }
};

const validateEditProfileData = (req) => {
    
    allowedEditFields = ["firstName", "lastName","photoURL", "age", "about", "gender", "skills"];

    // iterates body_fields => check if it is present in allowedEditFields or not => if all body_fields are present in allowedEditFields then only it will return true otherwise false  
    // Stops iterating immediately if the callback function returns a falsy value for any element.
    isAllowedFields = Object.keys(req.body).every(body_field => allowedEditFields.includes(body_field));
    return isAllowedFields;

};

module.exports = {
    validateSignUpData,
    validateEditProfileData
}