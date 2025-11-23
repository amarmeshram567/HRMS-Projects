const Employee = require("../models/employee");
const Log = require("../models/log");

// List all employees in the organisation
exports.list = async (req, res, next) => {
    try {
        const orgId = req.user.orgId;
        const employees = await Employee.findAll({ where: { organisation_id: orgId } });
        return res.status(200).json({ employees });
    } catch (error) {
        next(error);
    }
};

// Get a specific employee by ID
exports.get = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);

        if (!employee || employee.organisation_id !== req.user.orgId) {
            const err = new Error("Employee not found");
            err.statusCode = 404;
            return next(err);
        }

        return res.status(200).json({ employee });
    } catch (error) {
        next(error);
    }
};

// Create a new employee
exports.create = async (req, res, next) => {
    try {
        const orgId = req.user.orgId;
        const { first_name, last_name, email, phone } = req.body;

        const newEmployee = await Employee.create({
            first_name,
            last_name,
            email,
            phone,
            organisation_id: orgId,
        });

        await Log.create({
            organisation_id: orgId,
            user_id: req.user.userId,
            action: "employee_created",
            meta: { employeeId: newEmployee.id, first_name, last_name },
            timestamp: new Date(),
        });

        return res.status(201).json({ employee: newEmployee });
    } catch (error) {
        next(error);
    }
};

// Update an existing employee
exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;

        const emp = await Employee.findByPk(id);
        if (!emp || emp.organisation_id !== req.user.orgId) {
            const err = new Error("Employee not found");
            err.statusCode = 404;
            return next(err);
        }

        await emp.update(req.body);

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: "employee_updated",
            meta: { employeeId: id },
            timestamp: new Date(),
        });

        return res.status(200).json({ message: "Employee updated successfully", employee: emp });
    } catch (error) {
        next(error);
    }
};

// Delete an employee
exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;

        const emp = await Employee.findByPk(id);
        if (!emp || emp.organisation_id !== req.user.orgId) {
            const err = new Error("Employee not found");
            err.statusCode = 404;
            return next(err);
        }

        await emp.destroy();

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: "employee_deleted",
            meta: { employeeId: id },
            timestamp: new Date(),
        });

        return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        next(error);
    }
};
