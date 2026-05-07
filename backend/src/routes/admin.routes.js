const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/admin.controller')
const authMiddleware = require('../middlewares/auth.middleware')

adminRouter.post("/register", adminController.adminRegister)
adminRouter.post("/login", adminController.adminLogin)
adminRouter.get("/getAdmin", authMiddleware.getAdminRole, authMiddleware.isAdmin, adminController.getAdmin)
adminRouter.get("/logout", adminController.adminLogout)

module.exports = adminRouter