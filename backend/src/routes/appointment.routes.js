const express = require('express');
const appointmentRouter = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { getUserRole, getAdminRole, getDoctorRole, isAdmin, isUser, isDoctor } = require('../middlewares/auth.middleware');

//PATIENT/USER ROUTES
appointmentRouter.post("/create", getUserRole, isUser, appointmentController.createAppointment);
appointmentRouter.get("/user-appointments", getUserRole, isUser, appointmentController.getUserAppointments);
appointmentRouter.patch("/cancel/:appointmentId", getUserRole, isUser, appointmentController.cancelAppointment);
appointmentRouter.delete("/user/delete/:appointmentId", getUserRole, isUser, appointmentController.userDeleteAppointment);

//ADMIN ROUTES
appointmentRouter.get("/all", getAdminRole, isAdmin, appointmentController.getAllAppointments);
appointmentRouter.patch("/assign/:appointmentId", getAdminRole, isAdmin, appointmentController.assignDoctor);
appointmentRouter.patch("/status/:appointmentId", getAdminRole, isAdmin, appointmentController.updateAppointmentStatus);
appointmentRouter.delete("/delete/:appointmentId", getAdminRole, isAdmin, appointmentController.deleteAppointment);

//DOCTOR ROUTES
appointmentRouter.get("/doctor-appointments", getDoctorRole, isDoctor, appointmentController.getDoctorAppointments);
appointmentRouter.get("/doctor/stats", getDoctorRole, isDoctor, appointmentController.getDoctorStats);
appointmentRouter.patch("/doctor/status/:appointmentId", getDoctorRole, isDoctor, appointmentController.doctorUpdateStatus);
appointmentRouter.patch("/doctor/edit/:appointmentId", getDoctorRole, isDoctor, appointmentController.doctorEditAppointment);
appointmentRouter.delete("/doctor/delete/:appointmentId", getDoctorRole, isDoctor, appointmentController.doctorDeleteAppointment);

module.exports = appointmentRouter;