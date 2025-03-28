const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authorizeRole  = require('../middleware/authorizeRole');

const generateToken = (payload) => {
    return jwt.sign(payload,process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// user singup
const singup  = async (req,res) => {
    try {
        const { role_id, name, email, phone, password } = req.body;
        const created_by = req.user ? req.user.id : 1;
        const hashPassword = await bcrypt.hash(password,8);

        if(!role_id || !name || !email || !phone || !password || !created_by) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        const newUser = await db.User.create({
            role_id,
            name,
            email,
            phone,
            password: hashPassword,
            created_by
        }); 

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        }); 
    }
}

// user login
const login = async (req,res) => {
    try {
        const {email,password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        const result = await db.User.findOne({where: {email}});

        if(!result || !(await bcrypt.compare(password,result.password))) {
            return res.status(401).json({
                success:false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken({
            id: result.id,
            role_id: result.role_id
        });

        return res.status(200).json({
            success: true,
            token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        }); 
    }
}

// get all users
const getAllUsers = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(!isAdminstrator) {
            return res.status(401).json({ 
                success: false, 
                error: "Unauthorized Access" 
            });
        }

        const users = await db.User.findAll({
            attributes: { exclude: 'role_id' },
            include: {
                model: db.Role,
                attributes: ['id', 'role_name']
            }
        });
    
        if(!users) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
    
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        });
    }
}

// get user by id
const getUserById = async (req,res) => {
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
    
        const user = await db.User.findByPk(req.params.id, {
            attributes: { exclude: 'role_id' },
            include: {
                model: db.Role,
                attributes: ['id', 'role_name']
            }
        });
    
        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            })
        }
    
        return res.status(200).json({
            success: true,
            data: user
        }); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        });
    }
}

// update user
const updateUser = async (req,res) => {
    try {
        const userId = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(userId);

        if(!isAdminstrator) {
            return res.status(401).json({ 
                success: false, 
                error: "Unauthorized Access" 
            });
        }

        const { role_id,name,email,phone } = req.body;
        const updated_by = userId;

        if(!role_id || !name || !email || !phone || !updated_by || !req.params.id) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request'
            });
        }

        const user = await db.User.update({
            role_id,
            name,
            email,
            phone,
            updated_by
        }, {where: {id: req.params.id}});

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        }); 
    }
}

const changepassword = async (req,res) => {
    try {
        const userId = req.user.id;
        const {currentPassword, newPassword} = req.body;

        const user = await db.User.findByPk(userId);

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        const isMathch = await bcrypt.compare(currentPassword, user.password);
        if(!isMathch) {
            return res.status(404).json({
                success: false,
                error: "Current password is incorrect"
            })
        }

        // hash the new password
        const hashPassword = await bcrypt.hash(newPassword,8);
        user.password = hashPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password has been changed successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Changed password failed with error code: ${error}`
        })
    }
}

const changePasswordBySuperadmin = async (req,res) => {
    try {
        const user_id = req.user.id;
        const isAdminstrator = await authorizeRole.isAdminstrator(user_id);

        if(!isAdminstrator) {
            return res.status(401).json({ 
                success: false, 
                error: "Unauthorized Access" 
            });
        }
        const {userId,newPassword} = req.body;
  
        const user = await db.User.findByPk(userId);
        console.log("User", user);
        if(!user) {
            return res.status(404).json({
            success: false,
            error: "User not found"
            })
        }
  
        // hash the new password
        const hashPassword = await bcrypt.hash(newPassword,10);
        user.password = hashPassword;
        await user.save();
    
        return res.status(200).json({
            success: true,
            message: "Password has been changed successfully"
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: `Changed password failed with error code: ${error}`
      })
    }
};

// delete user
const deleteUser = async (req,res) => {
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
    
        const user = await db.User.findByPk(req.params.id);
    
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
            
        await user.destroy();
            
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ${error}`
        });
    }
}

module.exports = {singup, login, getAllUsers, getUserById, updateUser, deleteUser, changepassword, changePasswordBySuperadmin}