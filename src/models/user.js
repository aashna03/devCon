const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        maxLength: 50
    },
    lastName : {
        type: String
    },
    emailId : {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(`invalid email address: ${value}`)
            }
        }
    },
    password : {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error(`Enter Storng Password: ${value}`)
            }
        }
    },
    age : {
        type: Number,
        min: 18
    },
    gender : {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} gender is not valid`
        }
        // or
        // validate(value){
        //     // this validate function will not work by default if doing the PATCH, for new object it will happen
        //     if(!["male","female", "others"].includes(value)){
        //         throw new Error("Gender data is not valid")
        //     }
        // }
    },
    about:{
        type: String,
        default : "Available"
    },
    skills: {
        type: [String]
    },
    photoURL: {
        type: String,
        default: "https://robohash.org/mail@ashallendesign.co.uk",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error(`invalid photo URL: ${value}`)
            }
        }
    }
},
{
    timestamps : true
})

userSchema.index({firstName: 1, lastName: 1}); // for searching users by first name and last name

userSchema.methods.getJWT = async function(){    
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const passwordHashInDB = user.password;
    const isPasswordsMatch = await bcrypt.compare(
        passwordInputByUser, passwordHashInDB
    )
    return isPasswordsMatch;
}

const User = mongoose.model("User", userSchema);

module.exports = User;