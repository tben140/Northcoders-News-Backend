const express = require("express");
const apiRouter = require("./routes/apirouter.js");
const app = express();

console.log("In app.js...");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  const psqlCodes = ["22P02"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: err.message || "Bad Request" });
  }
  // console.log("Error Handling -> ", err, err.status, err.msg);
  res.status(err.status).send({ msg: err.msg });
});

app.use((req, res, next) => {
  return res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
