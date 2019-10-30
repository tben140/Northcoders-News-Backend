const connection = require("../dbconnection.js");

exports.selectUsers = username => {
  // console.log("Inside selectUsers");
  return connection
    .select("username", "avatar_url", "name")
    .from("users")
    .where("username", username);
};
