const express = require("express");
const apiRouter = require("./routes/apirouter.js");
const { psqlErrorHandler, RouteNotFoundHandler } = require("./errors/error.js");
const app = express();

console.log("In app.js...");

app.use(express.json());

app.use("/api", apiRouter);

app.use(psqlErrorHandler);

app.use(RouteNotFoundHandler);

module.exports = app;
