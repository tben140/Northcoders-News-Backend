const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment
} = require("../controllers/commentscontroller.js");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment);

module.exports = commentsRouter;
