const { updateComments, delComments } = require("../models/commentsmodel.js");

exports.patchComment = (req, res, next) => {
  // console.log("Inside patchComment ...");

  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (inc_votes === undefined) {
    res.status(400).send({ msg: "inc_votes not in body" });
  } else {
    return updateComments(comment_id, inc_votes)
      .then(comment => {
        // console.log("After updateComments before send ...");
        if (comment.length === 0) {
          res.status(404).send({ msg: "comment_id not found" });
        } else {
          res.status(201).send({ comment });
        }
      })
      .catch(next);
  }
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  // console.log("req.params ->", comment_id);
  return delComments(comment_id)
    .then(comment => {
      if (comment === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment_id not found"
        });
      } else {
        // console.log("Comment before send ->", comment);
        res.status(204).send({ comment });
      }
    })
    .catch(next);
};
