const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob:{
        type:Date,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;