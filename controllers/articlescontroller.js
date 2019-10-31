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

exports.patchArticles = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  // console.log(req.body, article_id, inc_votes);

  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ msg: "No inc_votes on request body" });
  }
  if (Object.keys(req.body).length > 1) {
    return res.status(400).send({ msg: "Other property on the request body" });
  }

  return updateArticles(article_id, inc_votes)
    .then(article => {
      const [articleObj] = article;
      res.status(201).send({ articleObj });
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
