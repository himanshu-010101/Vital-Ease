const express = require('express');
const departmentRouter = express.Router();
const departmentController = require('../controllers/department.controller');

departmentRouter.post('/create', departmentController.createDepartment);
departmentRouter.get('/all', departmentController.getAllDepartments);
departmentRouter.get('/', departmentController.getAllDepartments);
departmentRouter.get('/:id', departmentController.getDepartmentById);
departmentRouter.delete('/:id', departmentController.deleteDepartment);

module.exports = departmentRouter;