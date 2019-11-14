const { updateComments, delComments } = require("../models/commentsmodel.js");

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  return updateComments(comment_id, inc_votes)
    .then(updatedComment => {
      if (updatedComment.length === 0) {
        res.status(404).send({ msg: "comment_id not found" });
      } else {
        const [comment] = updatedComment;
        res.status(200).send({ comment });
      }
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return delComments(comment_id)
    .then(comment => {
      if (comment === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment_id not found"
        });
      } else {
        res.status(204).send({ comment });
      }
    })
    .catch(next);
};
