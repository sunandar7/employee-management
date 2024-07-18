const db = require('../models');
const multer = require('multer');
const path = require('path');
const authorizeRole = require('../middleware/authorizeRole');
const {getPaginatedData} = require('../utils/queryUtil');
const { Op } = require('sequelize');

// create employee
const create = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            const { employee_name, position_id, department_id, age, dob, father_name, address, phone, created_by } = req.body;
            const profile = req.file.path;

            if(!employee_name || !position_id || !department_id || !age || !dob || !father_name || !address || !phone || !profile || !created_by) {
                return res.status(400).json({
                    success: false,
                    error: 'All fields are required'
                });
            } 

            const newEmployee  = await db.Employee.create({
                employee_name,
                position_id,
                department_id,
                age,
                dob,
                father_name,
                address,
                phone,
                profile,
                created_by
            });

            return res.status(201).json({
                success: true,
                message: "Employee created successfully",
                data: newEmployee
            });
        } else {
            return res.status(401).json({
                success: false,
                error: "Unauthorized Access"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        }); 
    }
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads')
    },
    filename: (req,file,cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize: '1000000'},
    fileFilter: (req,file,cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null,true)
        }
        cb('Give proper file format to upload')
    }
}).single('profile');

// get all employees
const getAllEmployees = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const sort = req.query.sort ? JSON.parse(req.query.sort) : [['employee_name', 'ASC']];
            const filter = req.query.position_id ? { position_id: req.query.position_id } : {};
            const search = req.query.search ? { employee_name: { [Op.like]: `%${req.query.search}%` } } : {};
    
            // combined search & filter 
            const combinedFilter = { ...filter, ...search };
    
            const employees = await getPaginatedData(db.Employee, page, pageSize, combinedFilter, sort);
    
            if(!employees) {
                return res.status(404).json({
                    success: false,
                    error: "Employee not found"
                });
            }
    
            return res.status(200).json({
                success: true,
                data: employees
            });
        } else {
            return res.status(401).json({
                success: false,
                error: "Unauthorized Access"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        });
    }
}

// get employee by id
const getEmployeeById = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            if(!req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid parameter'
                });
            }
    
            const employee = await db.Employee.findByPk(req.params.id, {
                attributes: { exclude: ['position_id', 'department_id'] },
                include: [
                    {
                        model: db.Position,
                        attributes: ['id', 'position_name']
                    },
                    {
                        model: db.Department,
                        attributes: ['id', 'department_name']
                    }
                ]
            });
    
            if(!employee) {
                return res.status(404).json({
                    success: false,
                    error: 'Employee not found'
                })
            }
    
            return res.status(200).json({
                success: true,
                data: employee
            });
        } else {
            return res.status(401).json({
                success: false,
                error: "Unauthorized Access"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        });
    }
}

// update employee
const updateEmployee = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            const { employee_name, position_id, department_id, age, dob, father_name, address, phone, updated_by } = req.body;
            const profile = req.file.path;

            if(!employee_name || !position_id || !department_id || !age || !dob || !father_name || !address || !phone || !profile || !updated_by || !req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid request'
                });
            } 

            const employee = await db.Employee.update({
                employee_name,
                position_id,
                department_id,
                age,
                dob,
                father_name,
                address,
                phone,
                profile,
                updated_by
            }, {where: {id: req.params.id}});

            return res.status(200).json({
                success: true,
                message: 'Employee updated successfully',
                data: employee
            });
        } else {
            return res.status(401).json({
                success: false,
                error: "Unauthorized Access"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        }); 
    }
}

// delete employee
const deleteEmployee = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            if(!req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid parameter'
                });
            }
    
            const employee = await db.Employee.findByPk(req.params.id);
    
            if (!employee) {
                return res.status(404).json({
                  success: false,
                  error: 'Employee not found'
                });
            }
            
            await employee.destroy();
            
            return res.status(200).json({
                success: true,
                message: 'Employee deleted successfully'
            });
        } else {
            return res.status(401).json({
                success: false,
                error: "Unauthorized Access"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        })
    }
}

module.exports = { create, upload, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee }