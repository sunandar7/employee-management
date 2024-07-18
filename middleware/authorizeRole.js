const db = require('../models');

const isAdminstrator = async (userId) => {
    try {
      const result = await getUserRoleId(userId);
      return result === 1;
    } catch (error) {
      throw new Error(error.message);
    }
};

const isManager = async (userId) => {
    try {
      const result = await getUserRoleId(userId);
      return result === 2;
    } catch (error) {
      throw new Error(error.message);
    }
};

const isUser = async (userId) => {
    try {
      const result = await getUserRoleId(userId);
      return result === 3;
    } catch (error) {
      throw new Error(error.message);
    }
};

const getUserRoleId = async (userId) => {
    try {
      const user = await db.User.findOne({
        where: { id: userId },
        include: [{ model: db.Role }]
      });
    
      if (!user) {
        return 0;
      } else {
        return user.role_id;
      }
    } catch (error) {
      throw new Error("Error getting user role ID : " + error.message);
    }
};

module.exports = { isAdminstrator, isManager, isUser }