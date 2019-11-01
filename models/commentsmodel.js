const connection = require("../dbconnection.js");

exports.updateComments = (comment_id, inc_votes) => {
  // console.log("Inside updateComments ...");
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*");
};

exports.delComments = comment_id => {
  // console.log("Inside delComments ...");
  return connection("comments")
    .where("comment_id", comment_id)
    .del();
};
