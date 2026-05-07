const express = require('express');
const contactRouter = express.Router();
const contactController = require('../controllers/contact.controller');

contactRouter.post("/create", contactController.contactData);

contactRouter.get("/", contactController.getContacts);

contactRouter.patch("/update-status/:id", contactController.updateContactStatus);

contactRouter.delete("/delete/:id", contactController.deleteContact);

module.exports = contactRouter;