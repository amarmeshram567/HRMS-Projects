const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Employee = require("./employee");
const Team = require("./team");


const EmployeeTeam = sequelize.define("EmployeeTeam", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    team_id: { type: DataTypes.INTEGER, allowNull: false },
    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: "employee_teams", timestamps: true, underscored: true });


Employee.belongsToMany(Team, { through: EmployeeTeam, foreignKey: "employee_id", otherKey: "team_id" });
Team.belongsToMany(Employee, { through: EmployeeTeam, foreignKey: "team_id", otherKey: "employee_id" });

module.exports = EmployeeTeam;