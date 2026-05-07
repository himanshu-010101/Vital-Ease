const express = require('express')
const userRouter = express.Router();
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

userRouter.post("/register", userController.userRegister);
userRouter.post("/login", userController.userLogin);
userRouter.get("/logout", userController.userLogout)
userRouter.get("/getUser", authMiddleware.getUserRole, userController.getUser)
userRouter.get("/getAllUsers", authMiddleware.getAdminRole, authMiddleware.isAdmin, userController.getAllUsers)
userRouter.delete("/delete/:id", authMiddleware.getAdminRole, authMiddleware.isAdmin, userController.deleteUser)

module.exports = userRouter;