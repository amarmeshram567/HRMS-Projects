const express = require('express')
const { authMiddleware } = require('../middlewares/authMiddleware');
const { list, get, create, update, remove } = require('../controllers/employeeController');

const empRouter = express.Router()


empRouter.use(authMiddleware);
empRouter.get("/", list);
empRouter.get("/:id", get);
empRouter.post("/", create);
empRouter.put("/:id", update);
empRouter.delete("/:id", remove);


module.exports = empRouter