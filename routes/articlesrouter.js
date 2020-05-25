const articlesRouter = require("express").Router()
const {
  getArticles,
  getArticlesByArticleId,
  patchArticles,
  postCommentToArticle,
  getCommentsByArticleId,
} = require("../controllers/articlescontroller.js")
const { send405Error } = require("../errors/error.js")

articlesRouter.route("/").get(getArticles).all(send405Error)

articlesRouter
  .route("/:article_id")
  .get(getArticlesByArticleId)
  .patch(patchArticles)
  .all(send405Error)

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentToArticle)
  .all(send405Error)

module.exports = articlesRouter
