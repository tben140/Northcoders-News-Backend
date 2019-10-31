exports.psqlErrorHandler = (err, req, res, next) => {
  const psqlCodes = ["22P02"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: err.message || "Bad Request" });
  }
  res.status(err.status).send({ msg: err.msg });
};

exports.RouteNotFoundHandler = (req, res, next) => {
  return res.status(404).send({ msg: "Route not found" });
};
