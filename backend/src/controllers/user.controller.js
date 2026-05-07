const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklistToken.model');

async function userRegister(req, res) {
    try {
        const { fname, lname, email, phone, age, gender, dob, address, userName, password } = req.body;

        const isUserAlreadyExits = await userModel.findOne({
            $or: [{ userName }, { email }]
        });

        if (isUserAlreadyExits) {
            const field = isUserAlreadyExits.userName === userName ? "Username" : "Email";
            return res.status(400).json({
                message: `${field} already exists`
            })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const fullName = (fname + " " + lname).toUpperCase()
            const convertedDob = new Date(dob);
            const user = await userModel.create({
                fullName,
                email,
                phone,
                age,
                gender,
                dob: convertedDob,
                address,
                userName,
                password: hashedPassword
            });

            const token = jwt.sign({
                _id: user._id,
                role: "user"
            }, process.env.JWT_SECRET);

            res.cookie("userToken", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            res.status(201).json({
                message: "User created successfully",
                user: {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                    role: "user"
                }
            })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function userLogin(req, res) {
    try {
        const { userName, password } = req.body;
        const user = await userModel.findOne({ userName });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({
            _id: user._id,
            role: "user"
        }, process.env.JWT_SECRET);

        res.cookie("userToken", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                role: "user"
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function userLogout(req, res) {
    try {
        const token = req.cookies.userToken;
        if (token) {
            await blacklistModel.create({ token });
        }
        res.clearCookie("userToken", { path: '/' });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getUser(req, res) {
    try {
        if (!req.user || !req.user._id || req.user.role !== 'user') {
            return res.status(200).json({ user: null });
        }
        const user = await userModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(200).json({ user: null });
        }
        res.status(200).json({
            user: {
                ...user.toObject(),
                role: "user"
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await userModel.find({}).select("-password").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
}

module.exports = { userRegister, userLogin, userLogout, getUser, deleteUser, getAllUsers };