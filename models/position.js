const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Position = sequelize.define(
    "Position",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      position_name: {
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
      tableName: "positions",
    }
  );

  return Position;
};
