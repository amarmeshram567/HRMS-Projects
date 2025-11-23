const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { list, create, update, remove, assign, unassign } = require('../controllers/teamController');


const teamRouter = express.Router();

teamRouter.use(authMiddleware);

teamRouter.get("/", list);
teamRouter.post("/", create);
teamRouter.put("/:id", update);
teamRouter.delete("/:id", remove);
teamRouter.post("/:teamId/assign", assign);
teamRouter.post("/:teamId/unassign", unassign);


module.exports = teamRouter
