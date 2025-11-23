const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organisation = require("./organisation");


const Team = sequelize.define("Team", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    lead: { type: DataTypes.STRING },
    member_count: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: "teams",
    timestamps: true,
    underscored: true
});


Team.belongsTo(Organisation, { foreignKey: "organisation_id" });

module.exports = Team;