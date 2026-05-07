const mongoose = require('mongoose');

// Ensure all models are registered
require('./src/models/user.model');
require('./src/models/department.model');
require('./src/models/approvedDoctors.model');
const appointmentModel = require('./src/models/appointment.model');

async function test() {
    try {
        console.log("Connecting...");
        await mongoose.connect('mongodb://harshit005152_db_user:3gdQYSCHfNt4Xyls@ac-qmoexel-shard-00-00.zppjjdo.mongodb.net:27017,ac-qmoexel-shard-00-01.zppjjdo.mongodb.net:27017,ac-qmoexel-shard-00-02.zppjjdo.mongodb.net:27017/vitalease?ssl=true&replicaSet=atlas-r5nes8-shard-0&authSource=admin&appName=VitalEase');
        console.log("Connected. Fetching appointments...");
        
        const appointments = await appointmentModel
            .find()
            .populate("userId", "fullName email phone")
            .populate("departmentId", "name")
            .populate("doctorId", "fname lname"); 

        console.log("Success! Found", appointments.length, "appointments");
        console.log("First appointment:", JSON.stringify(appointments[0], null, 2));
    } catch (err) {
        console.error("FAILED WITH ERROR:", err.message);
        console.error(err.stack);
    } finally {
        await mongoose.disconnect();
    }
}

test();
