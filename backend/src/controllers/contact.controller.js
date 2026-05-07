const contactModel = require('../models/contact.model');

async function contactData(req, res) {
    try {
        const { fname, lname, phone, email, message } = req.body;

        const data = await contactModel.create({
            fname,
            lname,
            phone,
            email,
            message
        });

        res.status(201).json({
            message: "Contact information sent successfully",
            contact: data
        });
    } catch (error) {
        console.error("Contact creation error details:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error during contact creation",
            error: error.message 
        });
    }
}

async function getContacts(req, res) {
    try {
        const contacts = await contactModel.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            count: contacts.length,
            success: true,
            contacts: contacts
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching contacts", 
            error: error.message 
        });
    }
}

async function deleteContact(req, res) {
    try {
        const { id } = req.params;
        const deletedContact = await contactModel.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Contact deleted successfully",
            contact: deletedContact
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error deleting contact", 
            error: error.message 
        });
    }
}

async function updateContactStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting 'pending' or 'contacted'

        const updatedContact = await contactModel.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: `Status updated to ${status}`,
            contact: updatedContact 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { 
    contactData, 
    getContacts, 
    deleteContact, 
    updateContactStatus 
};