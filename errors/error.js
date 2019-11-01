exports.handleCustomErrors = (err, req, res, next) => {
  console.log("Custom errors->", err);
  if (err.status === 400) {
    console.log("err.msg before send ->", err.msg);
    res.status(400).send({ msg: err.msg || "Bad Request" });
  } else if (err.status === 404) {
    console.log("err.msg before send ->", err.msg);
    res.status(404).send({ msg: err.msg || "Not Found" });
  } else next(err);
};

exports.psqlErrorHandler = (err, req, res, next) => {
  console.log("PSQL Error ->", err);
  const psqlCodes = ["22P02"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: err.message || "Bad Request" });
  } else next(err);
};

exports.handleServerError = (err, req, res, next) => {
  console.log("Server Error ->", err);
  return res.status(500).send({ msg: err.message || "Internal Server Error" });
};

exports.RouteNotFoundHandler = (req, res, next) => {
  return res.status(404).send({ msg: "Route not found" });
};
