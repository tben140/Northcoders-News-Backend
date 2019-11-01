const connection = require("../dbconnection.js");

exports.selectTopics = () => {
  return connection.select("*").from("topics");
};
