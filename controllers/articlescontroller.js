const {
  selectArticlesByArticleId,
  updateArticles,
  insertCommentToArticle,
  selectCommentsByArticleId,
  selectArticles
} = require("../models/articlesmodel.js");

exports.getArticlesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticlesByArticleId(article_id)
    .then(article => {
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

//PatchArticles needs further work
exports.patchArticles = (req, res, next) => {
  console.log("In patchArticles controller...");
  const { article_id } = req.params;
  const inc_vote = req.body;
  const incValue = inc_vote.inc_votes;
  return updateArticles(article_id, incValue)
    .then(article => {
      console.log(
        "In postArticles controller before send ...",
        article_id,
        incValue
      );
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.postCommentToArticle = (req, res, next) => {
  console.log("In postCommentToArticle controller...");
  console.log("PARAMS AND BODY", req.params, req.body);
  const article_id = req.params.article_id;
  const commentBody = req.body.body;
  const username = req.body.username;

  return insertCommentToArticle(article_id, username, commentBody)
    .then(addedComment => {
      console.log("addedComment before send ->", addedComment);
      res.status(201).send({ addedComment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {};

exports.getArticles = (req, res, next) => {};
