const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    // Added status field
    status: {
        type: String,
        enum: ['pending', 'contacted'],
        default: 'pending'
    }
},
    {
        timestamps: true
    }
);

const contactModel = mongoose.model("contact", contactSchema);
module.exports = contactModel;