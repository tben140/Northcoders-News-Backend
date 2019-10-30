const articlesRouter = require("express").Router();
const { getArticles } = require("../controllers/articlescontroller.js");

articlesRouter.route("/:article_id").get(getArticles);

module.exports = articlesRouter;
