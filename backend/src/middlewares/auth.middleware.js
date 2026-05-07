const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklistToken.model')


async function getAdminRole(req, res, next) {
    const token = req.cookies.adminToken || req.cookies.token;
    if (!token) return res.status(401).json({ message: "Admin token not provided" });

    try {
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isTokenBlacklisted) return res.status(401).json({ message: "Token is invalid" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid admin token" });
    }
}

async function getUserRole(req, res, next) {
    const token = req.cookies.userToken || req.cookies.token;
    if (!token) return res.status(401).json({ message: "User token not provided" });

    try {
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isTokenBlacklisted) return res.status(401).json({ message: "Token is invalid" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid user token" });
    }
}

async function getDoctorRole(req, res, next) {
    const token = req.cookies.doctorToken || req.cookies.token;
    if (!token) return res.status(401).json({ message: "Doctor token not provided" });

    try {
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isTokenBlacklisted) return res.status(401).json({ message: "Token is invalid" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid doctor token" });
    }
}

async function isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Users only." });
    }
}

async function isDoctor(req, res, next) {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Doctors only." });
    }
}

async function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
}

async function checkAuth(req, res, next) {
    // Collect all potential tokens
    const tokens = [
        { val: req.cookies.adminToken, role: 'admin' },
        { val: req.cookies.doctorToken, role: 'doctor' },
        { val: req.cookies.userToken, role: 'user' },
        { val: req.cookies.token, role: 'unknown' }
    ].filter(t => t.val);

    if (tokens.length === 0) return next();

    for (const t of tokens) {
        try {
            const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token: t.val });
            if (!isTokenBlacklisted) {
                const decoded = jwt.verify(t.val, process.env.JWT_SECRET);
                req.user = decoded;
                // If we found a valid token, we move on
                return next();
            }
        } catch (err) {
            // Ignore single token failures and try the next one
        }
    }
    next();
}

module.exports = { getAdminRole, getUserRole, getDoctorRole, isUser, isDoctor, isAdmin, checkAuth };
