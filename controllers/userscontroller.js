const { selectUsers } = require("../models/usersmodel.js")

exports.getUsers = (req, res, next) => {
  const { username } = req.params
  return selectUsers(username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: "username not found",
        })
      } else {
        res.status(200).send({ user })
      }
    })
    .catch(next)
}
