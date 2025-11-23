
const express = require('express')
const { authMiddleware } = require('../middlewares/authMiddleware');
const Log = require('../models/log');


const logRouter = express.Router()

logRouter.use(authMiddleware);

logRouter.get("/", async (req, res) => {
    const logs = await Log.findAll({
        where: { organisation_id: req.user.orgId },
        order: [['created_at', 'DESC']]
    })

    res.status(200).json({ logs });
})


module.exports = logRouter