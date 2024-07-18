const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.BIGINT,
      },
    },
    {
      tableName: "roles",
    }
  );

  return Role;
};
