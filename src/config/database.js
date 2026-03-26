const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect(
        process.env.DATABASE
    );
};

module.exports = {
    connectDB
}