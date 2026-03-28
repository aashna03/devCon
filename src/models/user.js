const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minLength: 4,
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
        validate(value){
            // this validate function will not work by default if doing the PATCH, for new object it will happen
            if(!["male","female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
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

const User = mongoose.model("User", userSchema);

module.exports = User;