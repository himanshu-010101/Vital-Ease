const adminModel = require('../models/admin.model')
const TokenBlacklistModel = require('../models/blacklistToken.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function adminRegister(req, res) {
    const { name, userName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const capitalizeName = name.toUpperCase()
    const admin = await adminModel.create({
        name: capitalizeName,
        userName,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        _id: admin._id,
        role: "admin"
    }, process.env.JWT_SECRET)

    res.cookie("adminToken", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })

    res.status(201).json({
        message: "Admin created successfully",
        admin: {
            _id: admin._id,
            name: admin.name,
            userName: admin.userName,
            email: admin.email,
            role: "admin"
        }
    })
}

async function adminLogin(req, res) {
    const { userName, password } = req.body;

    const admin = await adminModel.findOne({ userName });
    if (!admin) {
        return res.status(400).json({
            message: "Invalid Username or Password",

        })
    }

    const isPasswordMatched = await bcrypt.compare(password, admin.password)
    if (!isPasswordMatched) {
        return res.status(400).json({
            message: "Invalid Username or Password"
        })
    }

    const token = jwt.sign({
        _id: admin._id,
        role: "admin"
    }, process.env.JWT_SECRET)

    res.cookie("adminToken", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })

    res.status(200).json({
        message: "Logged in successfully",
        admin: {
            _id: admin._id,
            name: admin.name,
            userName: admin.userName,
            email: admin.email,
            role: "admin"
        }
    })
}

async function getAdmin(req, res) {
    try {
        if (!req.user || !req.user._id || req.user.role !== 'admin') {
            return res.status(200).json({ admin: null });
        }
        const admin = await adminModel.findById(req.user._id).select('-password');
        if (!admin) {
            return res.status(200).json({ admin: null });
        }
        res.status(200).json({
            admin: {
                ...admin.toObject(),
                role: "admin"
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function adminLogout(req, res) {
    const token = req.cookies.adminToken;

    if (token) {
        await TokenBlacklistModel.create({ token })
    }

    res.clearCookie("adminToken", { path: '/' })
    res.status(200).json({
        message: "Admin log out successfully."
    })
}

module.exports = {
    adminRegister, adminLogin, adminLogout, getAdmin
}