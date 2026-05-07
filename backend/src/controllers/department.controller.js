const departmentModel = require('../models/department.model');


async function createDepartment(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Department name is required"
      });
    }

      const existing = await departmentModel.findOne({ name });

    if (existing) {
      return res.status(400).json({
        message: "Department already exists"
      });
    }

    const department = await departmentModel.create({ name });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating department",
      error: error.message
    });
  }
}

async function getAllDepartments(req, res) {
  try {
    const departments = await departmentModel.find();

    res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      departments
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching departments",
      error: error.message
    });
  }
}

async function getDepartmentById(req, res) {
  try {
    const { id } = req.params;

    const department = await departmentModel.findById(id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Department fetched successfully",
      department
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching department",
      error: error.message
    });
  }
}

async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const updated = await departmentModel.findByIdAndUpdate(
      id,
      { name, isActive },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating department",
      error: error.message
    });
  }
}

async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;

    const deleted = await departmentModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Department deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting department",
      error: error.message
    });
  }
}


module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};