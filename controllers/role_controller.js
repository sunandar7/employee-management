const db = require('../models');
const authorizeRole = require('../middleware/authorizeRole');

// create new role
const create = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            const { role_name, created_by } = req.body;

            if(!role_name || !created_by){
                return res.status(400).json({
                    success: false,
                    error: 'All fields are required'
                });
            }

            const newRole = await db.Role.create({
                role_name,
                created_by
            });

            return res.status(201).json({
                success: true,
                message: 'Role created successfully',
                data: newRole
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

// get all roles
const getAllRoles = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            const roles = await db.Role.findAll();

            if(!roles) {
                return res.status(404).json({
                    success: false,
                    error: 'Role not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: roles
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

// get role by id
const getRoleById = async (req,res) => {
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
    
            const role = await db.Role.findByPk(req.params.id)
    
            if(!role) {
                return res.status(404).json({
                    success: false,
                    error: 'Role not found'
                })
            }
    
            return res.status(200).json({
                success: true,
                data: role
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

// update role
const updateRole = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            const {role_name, updated_by} = req.body;

            if(!role_name || !updated_by || !req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid request'
                });
            }
    
            const role = await db.Role.update({role_name, updated_by}, {where: {id: req.params.id}});
        
            return res.status(200).json({
                success: true,
                message: 'Role updated successfully',
                data: role
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

// delete role
const deleteRole = async (req, res) => {
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
          
            const role = await db.Role.findByPk(req.params.id);
          
            if (!role) {
              return res.status(404).json({
                success: false,
                error: 'Role not found'
              });
            }
          
            await role.destroy();
          
            return res.status(200).json({
              success: true,
              message: 'Role deleted successfully'
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

module.exports = { create, getAllRoles, getRoleById, updateRole, deleteRole }