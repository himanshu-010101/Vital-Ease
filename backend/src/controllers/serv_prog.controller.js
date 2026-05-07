const serviceModel = require('../models/serv_prog.model');
const cloudinaryService = require('../services/cloudinary.services')

async function createServ_prog(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file provided"
            })
        }

        const { title, desc, type } = req.body;

        const result = await cloudinaryService.uploadFile(
            req.file.buffer,
            "services-imgages"
        );

        const service = await serviceModel.create({
            image : result.secure_url,
            title,
            desc,
            type,
        })

        res.status(201).json({
            message: "Service or Programme created successfully",
            service
        })
    }
    catch(err){
        console.error("Upload error: ", err)
        res.status(400).json({
            message: "Upload failed", error: err.message
        })
    }
}

async function getAllServ_prog(req, res) {
    try {
        const data = await serviceModel.find({});
        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch data",
            error: err.message
        });
    }
}

async function deleteServ_prog(req, res) {
    try {
        const { id } = req.params;
        const deletedItem = await serviceModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({
            message: "Deleted successfully",
            id
        });
    } catch (err) {
        res.status(500).json({
            message: "Deletion failed",
            error: err.message
        });
    }
}
module.exports = {
    createServ_prog, getAllServ_prog, deleteServ_prog
}