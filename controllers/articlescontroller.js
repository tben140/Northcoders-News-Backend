const { selectArticles } = require("../models/articlesmodel.js");

exports.getArticles = (req, res, next) => {
  // console.log("In getArticles controller...");
  const { article_id } = req.params;
  // console.log("Article_id -> ", article_id);
  return selectArticles(article_id)
    .then(article => {
      // console.log("Article -> ", article);
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found"
        });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};
