const { selectUsers } = require("../models/usersmodel.js");

exports.getUsers = (req, res, next) => {
  // console.log("getUsers controller ...");
  const { username } = req.params;
  // console.log("req.params ->", req.params);
  // console.log("Username -> ", username);
  return selectUsers(username).then(users => {
    // console.log("users -> ", users);
    res.status(200).send({ users });
  });
};
