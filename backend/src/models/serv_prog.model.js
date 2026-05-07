const mongoose = require('mongoose')

const serv_progSchema = mongoose.Schema({
    image:{
        type: String,
        required:true
    },
    title:{
        type: String,
        required:true
    },
    desc:{
        type: String,
    },
    type:{
        type: String,
        enum: ["service", "programme"],
        required: true
    }
})
const serv_progModel = mongoose.model("service", serv_progSchema);
module.exports = serv_progModel;