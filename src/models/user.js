const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String
    },
    emailId : {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique:true
    },
    password : {
        type: String,
        required: true
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
    }
},
{
    timestamps : true
})

const User = mongoose.model("User", userSchema);

module.exports = User;