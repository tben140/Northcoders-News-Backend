const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticlesByArticleId,
  patchArticles,
  postCommentToArticle,
  getCommentsByArticleId
} = require("../controllers/articlescontroller.js");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticlesByArticleId)
  .patch(patchArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentToArticle);

module.exports = articlesRouter;
