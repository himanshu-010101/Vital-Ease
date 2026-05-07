const doctorModel = require('../models/doctor.model');
const approvedDoctorModel = require('../models/approvedDoctors.model');
const blacklistModel = require('../models/blacklistToken.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function approveDoctor(req, res) {
    try {
        const { id } = req.params;

        const pendingDoctor = await doctorModel.findById(id).lean();

        if (!pendingDoctor) {
            return res.status(404).json({ message: "Doctor registration not found." });
        }

        if (!pendingDoctor.password) {
            return res.status(400).json({ message: "Pending doctor has no password. Cannot approve." });
        }

        const { _id, __v, createdAt, updatedAt, ...doctorData } = pendingDoctor;

        const approvedDoctor = await approvedDoctorModel.create({
            ...doctorData,
            password: pendingDoctor.password,
            isApproved: true,
            isDisplay: false
        });

        await doctorModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Doctor approved successfully.",
            newId: approvedDoctor._id
        });
    } catch (err) {
        console.error("Approval error:", err);
        res.status(500).json({ message: "Approval failed", error: err.message });
    }
}

async function doctorLogin(req, res) {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const identifier = userName.trim();

        let doctor = await approvedDoctorModel.findOne({
            $or: [
                { userName: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                { email: { $regex: new RegExp(`^${identifier}$`, 'i') } }
            ]
        });

        if (!doctor) {
            const pendingCandidate = await doctorModel.findOne({
                $or: [
                    { userName: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                    { email: { $regex: new RegExp(`^${identifier}$`, 'i') } }
                ]
            });

            if (pendingCandidate) {
                return res.status(403).json({ message: "Your account is pending approval by the admin." });
            }

            return res.status(401).json({ message: "Invalid username or password" });
        }

        if (!doctor.password) {
            return res.status(401).json({ message: "Account structure error. Please contact administrator." });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL: JWT_SECRET is not defined in environment variables");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const token = jwt.sign({
            _id: doctor._id,
            role: "doctor"
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("doctorToken", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            role: "doctor",
            doctor: {
                _id: doctor._id,
                userName: doctor.userName,
                email: doctor.email
            }
        });
    } catch (err) {
        console.error("Doctor Login error (Approved):", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function doctorLogout(req, res) {
    try {
        const token = req.cookies.doctorToken;
        if (token) {
            await blacklistModel.create({ token });
        }
        res.clearCookie("doctorToken", { path: '/' });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Doctor Logout error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function getApprovedDoctors(req, res) {
    try {
        const doctors = await approvedDoctorModel.find({})
            .select('-password')
            .populate('specialization');
        res.status(200).json(doctors);
    } catch (err) {
        console.error("Get Approved Doctors error:", err);
        res.status(500).json({ message: "Error", error: err.message });
    }
}

async function toggleDoctorDisplay(req, res) {
    try {
        const { id } = req.params;
        const doctor = await approvedDoctorModel.findById(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        doctor.isDisplay = !doctor.isDisplay;
        await doctor.save();

        res.status(200).json({
            success: true,
            message: `Doctor is now ${doctor.isDisplay ? 'visible' : 'hidden'} on the platform.`,
            isDisplay: doctor.isDisplay
        });
    } catch (err) {
        console.error("Toggle Display error:", err);
        res.status(500).json({
            success: false,
            message: "Toggle failed",
            error: err.message
        });
    }
}

async function deleteApprovedDoctor(req, res) {
    try {
        const { id } = req.params;
        const doctor = await approvedDoctorModel.findByIdAndDelete(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor deleted successfully."
        });
    } catch (err) {
        console.error("Delete Approved error:", err);
        res.status(500).json({
            success: false,
            message: "Delete failed",
            error: err.message
        });
    }
}

module.exports = {
    approveDoctor,
    doctorLogin,
    doctorLogout,
    getApprovedDoctors,
    toggleDoctorDisplay,
    deleteApprovedDoctor
};