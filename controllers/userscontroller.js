const { selectUsers } = require("../models/usersmodel.js");

exports.getUsers = (req, res, next) => {
  const { username } = req.params;
  return selectUsers(username)
    .then(([users]) => {
      if (!users) {
        return Promise.reject({
          status: 404,
          msg: "username not found"
        });
      } else {
        res.status(200).send(users);
      }
    })
    .catch(next);
};
