const topicsRouter = require("express").Router()
const { getTopics } = require("../controllers/topicscontroller.js")
const { send405Error } = require("../errors/error.js")

topicsRouter.route("/").get(getTopics).all(send405Error)

module.exports = topicsRouter
