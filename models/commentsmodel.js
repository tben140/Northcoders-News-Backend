const connection = require("../dbconnection.js");

exports.updateComments = (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return connection("comments")
      .where("comment_id", "=", comment_id)
      .returning("*");
  }
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*");
};

exports.delComments = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del();
};
