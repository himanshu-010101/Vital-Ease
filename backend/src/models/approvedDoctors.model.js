const mongoose = require('mongoose');

const approvedDoctorSchema = mongoose.Schema({
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
        required: true
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
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    isDisplay: {
        type: Boolean,
        default: false 
    }
},
    {
        timestamps: true
    }
);

const approvedDoctorModel = mongoose.model("ApprovedDoctor", approvedDoctorSchema);

module.exports = approvedDoctorModel;