const express = require("express")
const apiRouter = require("./routes/apirouter.js")
const {
  psqlErrorHandler,
  RouteNotFoundHandler,
  handleCustomErrors,
  handleServerError,
} = require("./errors/error.js")
const cors = require("cors")
const app = express()

app.use(cors())

app.use(express.json())

app.use("/api", apiRouter)

app.use("/*", RouteNotFoundHandler)

app.use(handleCustomErrors)

app.use(psqlErrorHandler)

app.use(handleServerError)

module.exports = app
