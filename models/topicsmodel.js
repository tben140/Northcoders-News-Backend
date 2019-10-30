const connection = require("../dbconnection.js");
// const topicData = require("../db/data/test-data/topics.js");

exports.selectTopics = () => {
  return connection.select("*").from("topics");
};
