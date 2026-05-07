const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ApprovedDoctor",
    default: null
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  visitType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "forwarded", "confirmed", "rejected", "completed"],
    default: "pending"
  }
}, { timestamps: true });

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

module.exports = appointmentModel;