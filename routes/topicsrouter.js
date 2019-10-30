const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicscontroller.js");

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
