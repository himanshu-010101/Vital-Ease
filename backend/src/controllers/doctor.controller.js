const doctorModel = require('../models/doctor.model')
const approvedDoctorModel = require('../models/approvedDoctors.model')
const cloudinaryService = require('../services/cloudinary.services');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const blacklistModel = require('../models/blacklistToken.model')

async function doctorRegister(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file provided"
            })
        }

        const { fname, lname, email, phone, age, gender, specialization, userName, password } = req.body;

        const isDoctorAlreadyExists = await doctorModel.findOne({
            $or: [{ userName }, { email }]
        });

        if (isDoctorAlreadyExists) {
            const field = isDoctorAlreadyExists.userName === userName ? "Username" : "Email";
            return res.status(400).json({
                message: `${field} already exists`
            });
        }

        const result = await cloudinaryService.uploadFile(
            req.file.buffer,
            "doctor-imgages"
        );

        const hashedPassword = await bcrypt.hash(password, 10)
        const doctor = await doctorModel.create({
            fname,
            lname,
            email,
            phone,
            age,
            gender,
            photo: result.secure_url,
            specialization,
            userName,
            password: hashedPassword
        })

        res.status(201).json({
            message: "Registration submitted. Please wait for admin approval before logging in.",
            doctor: {
                name: doctor.fname + " " + doctor.lname,
                email,
                userName
            }
        })
    }
    catch (err) {
        console.error("Upload error: ", err)
        res.status(400).json({
            message: "Upload failed", error: err.message
        })
    }
}

async function doctorLogin(req, res) {
    try {
        const { userName, password } = req.body;

        let doctor = await approvedDoctorModel.findOne({
            $or: [{ userName: userName }, { email: userName }]
        });

        if (!doctor) {
            // Check if they are pending to give a better error message
            const pendingCandidate = await doctorModel.findOne({
                $or: [{ userName: userName }, { email: userName }]
            });

            if (pendingCandidate) {
                return res.status(403).json({ message: "Your account is pending approval by the admin." });
            }

            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Guard against missing password field in database (e.g. legacy data)
        if (!doctor.password) {
            return res.status(401).json({ message: "Account structure error. Please contact administrator." });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({
            _id: doctor._id,
            role: "doctor"
        }, process.env.JWT_SECRET);

        res.cookie("doctorToken", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            message: "Login successful",
            doctor: {
                _id: doctor._id,
                userName: doctor.userName,
                email: doctor.email,
                role: "doctor"
            }
        });
    } catch (err) {
        console.error("Doctor Login error:", err);
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

async function getDoctor(req, res) {
    try {
        if (!req.user || !req.user._id || req.user.role !== 'doctor') {
            return res.status(200).json({ doctor: null });
        }
        // Strictly use approved doctors for session checks
        let doctor = await approvedDoctorModel.findById(req.user._id)
            .select('-password')
            .populate('specialization', 'name');

        if (!doctor) {
            return res.status(200).json({ doctor: null });
        }
        res.status(200).json({
            doctor: {
                ...doctor.toObject(),
                role: "doctor"
            }
        });
    } catch (err) {
        console.error("Get Doctor error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

async function deletePendingDoctor(req, res) {
    try {
        const { id } = req.params;

        const doctor = await doctorModel.findByIdAndDelete(id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor registration not found."
            });
        }

        res.status(200).json({
            message: "Doctor registration deleted successfully."
        });
    } catch (err) {
        console.error("Delete Pending error:", err);
        res.status(500).json({
            message: "Failed to delete registration",
            error: err.message
        });
    }
}

async function getAllPendingDoctors(req, res) {
    try {
        const doctors = await doctorModel.find()
            .select('-password')
            .populate('specialization', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: doctors.length,
            doctors
        });
    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch doctors list",
            error: err.message
        });
    }
}

module.exports = {
    doctorRegister,
    doctorLogin,
    doctorLogout,
    getDoctor,
    deletePendingDoctor,
    getAllPendingDoctors
};