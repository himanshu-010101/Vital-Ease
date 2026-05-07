const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Conected")
    }
    catch(err){
        console.error("Database Error: ",err)
    }
}

module.exports = connectDB;