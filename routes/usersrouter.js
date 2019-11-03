const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/userscontroller.js");
const { send405Error } = require("../errors/error.js");

usersRouter
  .route("/:username")
  .get(getUsers)
  .all(send405Error);

module.exports = usersRouter;
