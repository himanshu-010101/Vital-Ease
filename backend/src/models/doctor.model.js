const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
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
    photo: {
        type: String,
        required: true
    },
    specialization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
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
const doctorModel = mongoose.model("Doctor", doctorSchema);

module.exports = doctorModel; 