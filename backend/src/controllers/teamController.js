const Employee = require("../models/employee");
const EmployeeTeam = require("../models/employeeTeam");
const Log = require("../models/log");
const Team = require("../models/team");

// List Teams
exports.list = async (req, res, next) => {
    try {
        const orgId = req.user.orgId;
        const teams = await Team.findAll({ where: { organisation_id: orgId } });
        return res.status(200).json({ teams });
    } catch (error) {
        next(error);
    }
};


// Create Team
exports.create = async (req, res, next) => {
    try {
        const orgId = req.user.orgId;
        const { name, description, lead, member_count } = req.body;

        console.log(req.body);


        const team = await Team.create({
            name,
            description,
            lead,
            member_count,
            organisation_id: orgId
        });

        await Log.create({
            organisation_id: orgId,
            user_id: req.user.userId,
            action: "team_created",
            meta: {
                teamId: team.id,
                team_name: team.name,
                description: team.description,
                lead: team.lead,
                member_count: team.member_count
            },
            timestamp: new Date()
        });

        return res.status(201).json({ team });
    } catch (error) {
        next(error);
    }
};


// Update Team
exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const team = await Team.findByPk(id);

        if (!team || team.organisation_id !== req.user.orgId) {
            const err = new Error("Team not found");
            err.statusCode = 404;
            return next(err);
        }

        await team.update(req.body);

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: "team_updated",
            meta: { teamId: team.id },
            timestamp: new Date()
        });

        return res.status(200).json({ team });
    } catch (error) {
        next(error);
    }
};

// Delete Team
exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const team = await Team.findByPk(id);

        if (!team || team.organisation_id !== req.user.orgId) {
            const err = new Error("Team not found");
            err.statusCode = 404;
            return next(err);
        }

        await team.destroy();

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: "team_deleted",
            meta: { teamId: id },
            timestamp: new Date()
        });

        return res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Assign Employee(s) to Team
exports.assign = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const { employeeId, employeeIds } = req.body;

        const ids = employeeIds || (employeeId ? [employeeId] : []);
        if (ids.length === 0) {
            const err = new Error("No employee IDs provided");
            err.statusCode = 400;
            return next(err);
        }

        const team = await Team.findByPk(teamId);
        if (!team || team.organisation_id !== req.user.orgId) {
            const err = new Error("Team not found");
            err.statusCode = 404;
            return next(err);
        }

        const assignments = [];

        for (let eid of ids) {
            const employee = await Employee.findByPk(eid);

            if (!employee || employee.organisation_id !== req.user.orgId) {
                const err = new Error(`Employee with ID ${eid} not found`);
                err.statusCode = 404;
                return next(err);
            }

            const [rec, created] = await EmployeeTeam.findOrCreate({
                where: { employee_id: eid, team_id: teamId }
            });

            assignments.push({ employeeId: eid, created });

            await Log.create({
                organisation_id: req.user.orgId,
                user_id: req.user.userId,
                action: "assigned_employee_to_team",
                meta: { employeeId: eid, teamId },
                timestamp: new Date()
            });
        }

        return res.status(200).json({ assignments });
    } catch (error) {
        next(error);
    }
};

// Unassign Employee from Team
exports.unassign = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const { employeeId } = req.body;

        if (!employeeId) {
            const err = new Error("No employee ID provided");
            err.statusCode = 400;
            return next(err);
        }

        await EmployeeTeam.destroy({
            where: { employee_id: employeeId, team_id: teamId }
        });

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: "unassigned_employee_from_team",
            meta: { employeeId, teamId },
            timestamp: new Date()
        });

        return res.status(200).json({ message: "Employee unassigned successfully" });
    } catch (error) {
        next(error);
    }
};
