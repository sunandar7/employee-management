const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
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
      tableName: "users",
    }
  );

  return User;
};
