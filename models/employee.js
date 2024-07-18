const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Employee = sequelize.define(
    "Employee",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      employee_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER
      },
      dob: {
        type: DataTypes.DATE
      },
      father_name: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.TEXT
      },
      phone: {
        type: DataTypes.STRING
      },
      profile: {
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
      tableName: "employees",
    }
  );

  return Employee;
};
