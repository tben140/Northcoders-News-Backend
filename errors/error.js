exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: err.msg || "Bad Request" })
  } else if (err.status === 404) {
    res.status(404).send({ msg: err.msg || "Not Found" })
  } else next(err)
}

exports.psqlErrorHandler = (err, req, res, next) => {
  const psqlCodes = ["22P02", "42703", "23503"]
  if (psqlCodes.includes(err.code)) {
    const splitMsg = err.message.split("-")[1]
    res.status(400).send({ msg: splitMsg || "Bad Request" })
  } else next(err)
}

exports.handleServerError = (err, req, res, next) => {
  return res.status(500).send({ msg: err.message || "Internal Server Error" })
}

exports.RouteNotFoundHandler = (req, res, next) => {
  return res.status(404).send({ msg: "Route not found" })
}

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" })
}
