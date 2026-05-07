const express = require('express');
const servRouter = express.Router();
const serv_progController = require('../controllers/serv_prog.controller')
const upload = require('../middlewares/upload.middleware')

servRouter.post("/create", upload.single("file"), serv_progController.createServ_prog);
servRouter.get("/", serv_progController.getAllServ_prog);
servRouter.delete("/delete/:id", serv_progController.deleteServ_prog);

module.exports = servRouter