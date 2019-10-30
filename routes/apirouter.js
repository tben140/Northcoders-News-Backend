const apiRouter = require("express").Router();
const articlesRouter = require("./articlesrouter.js");
const commentsRouter = require("./commentsrouter.js");
const topicsRouter = require("./topicsrouter.js");
const usersRouter = require("./usersrouter.js");

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

// apiRouter.use("/articles/:article_id/comments", articlesRouter);

// apiRouter.use("/articles", articlesRouter);

// apiRouter.use("/comments/:comment_id", commentsRouter);

module.exports = apiRouter;
