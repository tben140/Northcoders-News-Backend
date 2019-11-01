const express = require("express");
const apiRouter = require("./routes/apirouter.js");
const {
  psqlErrorHandler,
  RouteNotFoundHandler,
  handleCustomErrors,
  handleServerError
} = require("./errors/error.js");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("/*", RouteNotFoundHandler);

app.use(handleCustomErrors);

app.use(psqlErrorHandler);

app.use(handleServerError);

module.exports = app;
