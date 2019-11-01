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
        res.status(200).send(article);
      }
    })
    .catch(next);
};

exports.patchArticles = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  // console.log(req.body, article_id, inc_votes);

  if (Object.keys(req.body).length === 0) {
    return Promise.reject({
      status: 400,
      msg: "No inc_votes on request body"
    });
  } else if (Object.keys(req.body).length > 1) {
    return Promise.reject({
      status: 400,
      msg: "Other property on the request body"
    });
  } else {
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

  const { article_id } = req.params;
  const { username, body } = req.body;
  console.log("article_id, username, body", article_id, username, body);

  return insertCommentToArticle(article_id, username, body)
    .then(addedComment => {
      console.log("addedComment before send ->", addedComment);
      res.status(201).send({ addedComment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  return selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  console.log("Inside getArticles controller...");
  const { sort_by, order, author, topic } = req.query;
  console.log(sort_by, order, author, topic);
  return selectArticles(sort_by, order, author, topic)
    .then(articles => {
      console.log("Inside then block ...");
      console.log(articles);
      res.status(200).send({ articles });
    })
    .catch(next);
};
