const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organisation = require("./organisation");



const Employee = sequelize.define("Employee", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING },
}, { tableName: "employees", timestamps: true, underscored: true });


Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });

module.exports = Employee;