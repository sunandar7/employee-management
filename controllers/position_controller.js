const db = require('../models');
const authorizeRole = require('../middleware/authorizeRole');

// create position
const create = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            const {position_name, created_by} = req.body;

            if(!position_name || !created_by) {
                return res.status(400).json({
                    success: false,
                    error: 'All fields are required'
                });
            }

            const newPosition = await db.Position.create({
                position_name,
                created_by
            });

            return res.status(201).json({
                success: true,
                message: 'Position created successfully',
                data: newPosition
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

// get all positions
const getAllPositions = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            const positions = await db.Position.findAll();

            if(!positions) {
                return res.status(404).json({
                    success: false,
                    error: "Position not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: positions
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

// get position by id
const getPositionById = async (req,res) => {
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
    
            const position = await db.Position.findByPk(req.params.id);
    
            if(!position) {
                return res.status(404).json({
                    success: false,
                    error: 'Position not found'
                })
            }
    
            return res.status(200).json({
                success: true,
                data: position
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

// update position
const updatePosition = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(isAdminstrator) {
            const {position_name, updated_by} = req.body;

            if(!position_name || !updated_by || !req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid request'
                });
            }
    
            const position = await db.Position.update({position_name, updated_by}, {where: {id: req.params.id}});
        
            return res.status(200).json({
                success: true,
                message: 'Position updated successfully',
                data: position
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

// delete positiom
const deletePosition = async (req, res) => {
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
          
            const position = await db.Position.findByPk(req.params.id);
          
            if (!position) {
              return res.status(404).json({
                success: false,
                error: 'Position not found'
              });
            }
          
            await position.destroy();
          
            return res.status(200).json({
              success: true,
              message: 'Position deleted successfully'
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

module.exports = {create, getAllPositions, getPositionById, updatePosition, deletePosition}