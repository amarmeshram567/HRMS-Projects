const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Organisation = require("../models/organisation");
const User = require("../models/user");
const Log = require("../models/log");
require("dotenv").config();

exports.register = async (req, res, next) => {
    try {
        const { orgName, adminName, email, password } = req.body;

        if (!orgName || !adminName || !email || !password) {
            const err = new Error("All fields are required");
            err.statusCode = 400;
            return next(err);
        }

        const org = await Organisation.create({ name: orgName });
        const password_hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            organisation_id: org.id,
            email,
            password_hash,
            name: adminName,
        });

        const token = jwt.sign(
            { userId: user.id, orgId: org.id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        await Log.create({
            organisation_id: org.id,
            user_id: user.id,
            action: "organisation_registered",
            meta: { orgId: org.id, userId: user.id },
            timestamp: new Date(),
        });

        return res.status(201).json({
            token,
            message: "Registration successful",
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            return next(err);
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            return next(err);
        }

        const token = jwt.sign(
            { userId: user.id, orgId: user.organisation_id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        await Log.create({
            organisation_id: user.organisation_id,
            user_id: user.id,
            action: "user_logged_in",
            meta: { userId: user.id },
            timestamp: new Date(),
        });

        return res.status(200).json({
            token,
            message: "Login successful",
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const orgId = req.user.orgId;

        await Log.create({
            organisation_id: orgId,
            user_id: userId,
            action: "user_logged_out",
            meta: { userId },
            timestamp: new Date(),
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
};
