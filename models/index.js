require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: 3306,
    timezone: process.env.DB_TIMEZONE, // for writing to database
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../models/user")(sequelize, DataTypes);
db.Role = require("../models/role")(sequelize, DataTypes);
db.Employee = require("../models/employee")(sequelize, DataTypes);
db.Department = require("../models/department")(sequelize, DataTypes);
db.Position = require("../models/position")(sequelize, DataTypes);

// Associations
db.User.belongsTo(db.Role, { foreignKey: "role_id" });
db.Employee.belongsTo(db.Department, { foreignKey: "department_id" });
db.Employee.belongsTo(db.Position, { foreignKey: "position_id" });

module.exports = db;
