const { updateComments, delComments } = require("../models/commentsmodel.js");

exports.patchComment = (req, res, next) => {
  console.log("Inside patchComment ...");

  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  return updateComments(comment_id, inc_votes)
    .then(comment => {
      console.log("After updateComments before send ...");
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  console.log("req.params ->", comment_id);
  return delComments(comment_id)
    .then(comment => {
      console.log("Comment before send ->", comment);
      res.status(204).send({ comment });
    })
    .catch(next);
};
