const commentsRouter = require("express").Router()
const {
  patchComment,
  deleteComment,
} = require("../controllers/commentscontroller.js")
const { send405Error } = require("../errors/error.js")

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(send405Error)

module.exports = commentsRouter
