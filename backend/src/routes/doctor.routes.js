const express = require('express');
const docRouter = express.Router();
const upload = require('../middlewares/upload.middleware')
const doctorController = require('../controllers/doctor.controller')

const { getDoctorRole, isDoctor, checkAuth } = require('../middlewares/auth.middleware');

docRouter.post("/register", upload.single("file"), doctorController.doctorRegister);
docRouter.post("/login", doctorController.doctorLogin);
docRouter.get("/logout", doctorController.doctorLogout);
docRouter.get("/get-doctor", getDoctorRole, doctorController.getDoctor);
docRouter.get("/all-pending-doctors", doctorController.getAllPendingDoctors);
docRouter.delete("/delete-pending-doctor/:id", doctorController.deletePendingDoctor);

module.exports = docRouter;