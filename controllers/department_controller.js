const db = require('../models');
const authorizeRole = require('../middleware/authorizeRole');

// create department
const create = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(!isAdminstrator) {
            return res.status(401).json({ 
                success: false, 
                error: "Unauthorized Access" 
            });
        }

        const {department_name} = req.body;
        const created_by = userId;

        if(!department_name || !created_by) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        const newDepartment = await db.Department.create({
            department_name,
            created_by
        });

        return res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: newDepartment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        }); 
    }
}

// get all departments
const getAllDepartments = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(!isAdminstrator) {
            return res.status(401).json({ 
                success: false, 
                error: "Unauthorized Access" 
            });
        }

        const departments = await db.Department.findAll();

        if(!departments) {
            return res.status(404).json({
                success: false,
                error: "Department not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        });
    }
}

// get department by id
const getDepartmentById = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(!isAdminstrator) {
            return res.status(401).json({ 
                success: false, 
                error: "Unauthorized Access" 
            });
        }

        if(!req.params.id) {
            return res.status(400).json({
                success: false,
                error: 'Invalid parameter'
            });
        }
    
        const department = await db.Department.findByPk(req.params.id)
    
        if(!department) {
            return res.status(404).json({
                success: false,
                error: 'Department not found'
            })
        }
    
        return res.status(200).json({
            success: true,
            data: department
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        });
    }
}

// update department
const updateDepartment = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(!isAdminstrator) {
            return res.status(401).json({ 
                success: false, 
                error: "Unauthorized Access" 
            });
        }

        const {department_name} = req.body;
        const updated_by = userId;

        if(!department_name || !updated_by || !req.params.id) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request'
            });
        }
    
        const department = await db.Department.update({department_name, updated_by}, {where: {id: req.params.id}});
        
        return res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    } catch (error) {
       return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        }); 
    }
} 

// delete department
const deleteDepartment = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(!isAdminstrator) {
            return res.status(401).json({ 
                success: false, 
                error: "Unauthorized Access" 
            });
        }

        if(!req.params.id) {
            return res.status(400).json({
                success: false,
                error: 'Invalid parameter'
            });
        }
          
        const department = await db.Department.findByPk(req.params.id);
          
        if (!department) {
            return res.status(404).json({
                success: false,
                error: 'Department not found'
            });
        }
          
        await department.destroy();
          
        return res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        });
    }
}

module.exports = {create, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment}