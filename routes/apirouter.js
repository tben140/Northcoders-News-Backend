const apiRouter = require("express").Router()
const articlesRouter = require("./articlesrouter.js")
const commentsRouter = require("./commentsrouter.js")
const topicsRouter = require("./topicsrouter.js")
const usersRouter = require("./usersrouter.js")
const { send405Error } = require("../errors/error.js")
const endpoints = require("../endpoints.json")

apiRouter.route("/").get(getEndpoints).all(send405Error)

apiRouter.use("/topics", topicsRouter)

apiRouter.use("/users", usersRouter)

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/comments", commentsRouter)

function getEndpoints(req, res, next) {
  res.status(200).json(endpoints)
}

module.exports = apiRouter
