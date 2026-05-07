const express = require('express');
const approvedDoctorsRouter = express.Router();
const approvedDoctorsController = require("../controllers/approvedDoctors.controller");

approvedDoctorsRouter.get("/all-approved-doctors", approvedDoctorsController.getApprovedDoctors);
approvedDoctorsRouter.post("/login", approvedDoctorsController.doctorLogin);
approvedDoctorsRouter.get("/logout", approvedDoctorsController.doctorLogout);
approvedDoctorsRouter.post("/approve/:id", approvedDoctorsController.approveDoctor);
approvedDoctorsRouter.patch("/toggle-display/:id", approvedDoctorsController.toggleDoctorDisplay);
approvedDoctorsRouter.delete("/delete/:id", approvedDoctorsController.deleteApprovedDoctor);

module.exports = approvedDoctorsRouter;