const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/userscontroller.js");

usersRouter.route("/:username").get(getUsers);

module.exports = usersRouter;
