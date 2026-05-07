const appointmentModel = require('../models/appointment.model');
const userModel = require('../models/user.model');
const mongoose = require('mongoose');

// USER/PATIENT CONTROLLERS

async function createAppointment(req, res) {
  try {
    const { departmentId, appointmentDate, timeSlot, symptoms, visitType } = req.body;
    const userId = req.user._id;

    if (!departmentId || !appointmentDate || !timeSlot || !visitType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAppointment = new appointmentModel({
      userId,
      departmentId,
      appointmentDate,
      timeSlot,
      symptoms,
      visitType,
      status: "pending"
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment: newAppointment
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({ success: false, message: "Failed to create appointment", error: error.message });
  }
}

async function getUserAppointments(req, res) {
  try {
    const userId = req.user._id;
    const appointments = await appointmentModel.find({ userId })
      .populate("departmentId", "name")
      .populate("doctorId", "fname lname photo email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error("Get user appointments error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments", error: error.message });
  }
}

async function cancelAppointment(req, res) {
  try {
    const { appointmentId } = req.params;
    const userId = req.user._id;

    const appointment = await appointmentModel.findOneAndUpdate(
      { _id: appointmentId, userId },
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not owned by you" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({ success: false, message: "Failed to cancel appointment", error: error.message });
  }
}

async function userDeleteAppointment(req, res) {
  try {
    const { appointmentId } = req.params;
    const userId = req.user._id;

    const appointment = await appointmentModel.findOneAndDelete({ _id: appointmentId, userId });

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found or not owned by you" });
    }

    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("User delete appointment error:", error);
    res.status(500).json({ success: false, message: "Failed to delete appointment", error: error.message });
  }
}

// ADMIN CONTROLLERS

async function getAllAppointments(req, res) {
  try {
    const appointments = await appointmentModel.find()
      .populate("userId", "fullName email phone photo age gender")
      .populate("departmentId", "name")
      .populate("doctorId", "fname lname photo specialization")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error("Get all appointments error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch all appointments", error: error.message });
  }
}

async function assignDoctor(req, res) {
  try {
    const { appointmentId } = req.params;
    const { doctorId } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { doctorId, status: "forwarded" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Doctor assigned and status updated to forwarded",
      appointment
    });
  } catch (error) {
    console.error("Assign doctor error:", error);
    res.status(500).json({ success: false, message: "Failed to assign doctor", error: error.message });
  }
}

async function updateAppointmentStatus(req, res) {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      appointment
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { appointmentId } = req.params;
    const appointment = await appointmentModel.findByIdAndDelete(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete appointment", error: error.message });
  }
}

// DOCTOR SPECIFIC CONTROLLERS

async function getDoctorAppointments(req, res) {
  try {
    const doctorId = req.user._id;
    const appointments = await appointmentModel.find({ doctorId })
      .populate("userId", "fullName email phone photo age gender")
      .populate("departmentId", "name")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      message: "Doctor appointments fetched successfully",
      appointments
    });
  } catch (error) {
    console.error("Get doctor appointments error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments", error: error.message });
  }
}

async function getDoctorStats(req, res) {
  try {
    const doctorId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await appointmentModel.find({ doctorId });

    const stats = {
      total: appointments.length,
      today: appointments.filter(a => {
        const d = new Date(a.appointmentDate);
        return d >= today && d < tomorrow;
      }).length,
      forwarded: appointments.filter(a => a.status === "forwarded").length,
      confirmed: appointments.filter(a => a.status === "confirmed").length,
      completed: appointments.filter(a => a.status === "completed").length,
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Get doctor stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats", error: error.message });
  }
}

async function doctorUpdateStatus(req, res) {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const doctorId = req.user._id;

    const validStatus = ["confirmed", "rejected", "completed", "pending", "forwarded"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status for doctor update" });
    }

    const appointment = await appointmentModel.findOne({ _id: appointmentId, doctorId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not assigned to you" });
    }

    appointment.status = status;
    
    // If status is set back to pending, unassign the doctor
    if (status === "pending") {
      appointment.doctorId = null;
    }

    await appointment.save();

    res.status(200).json({ success: true, message: "Status updated successfully", appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
}

async function doctorEditAppointment(req, res) {
  try {
    const { appointmentId } = req.params;
    const { appointmentDate, timeSlot } = req.body;
    const doctorId = req.user._id;

    if (!appointmentDate || !timeSlot) {
      return res.status(400).json({ message: "Date and Time Slot are required" });
    }

    const appointment = await appointmentModel.findOne({ _id: appointmentId, doctorId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not assigned to you" });
    }

    appointment.appointmentDate = appointmentDate;
    appointment.timeSlot = timeSlot;
    
    await appointment.save();

    res.status(200).json({ success: true, message: "Appointment rescheduled successfully", appointment });
  } catch (error) {
    console.error("Doctor edit appointment error:", error);
    res.status(500).json({ success: false, message: "Failed to reschedule appointment", error: error.message });
  }
}

async function doctorDeleteAppointment(req, res) {
  try {
    const { appointmentId } = req.params;
    const doctorId = req.user._id;

    const appointment = await appointmentModel.findOneAndDelete({ _id: appointmentId, doctorId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not assigned to you" });
    }

    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete appointment", error: error.message });
  }
}

module.exports = {
  createAppointment,
  getUserAppointments,
  getAllAppointments,
  assignDoctor,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
  getDoctorAppointments,
  getDoctorStats,
  doctorUpdateStatus,
  doctorEditAppointment,
  doctorDeleteAppointment,
  userDeleteAppointment
};
