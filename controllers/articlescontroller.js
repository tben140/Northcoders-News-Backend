const {
  selectArticlesByArticleId,
  updateArticles,
  insertCommentToArticle,
  selectCommentsByArticleId,
  selectArticles,
  checkAuthorExists,
  checkTopicExists,
  checkforArticleId
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

  if (Object.keys(req.body).length > 1) {
    res.status(400).send({ msg: "Other property on the request body" });
  } else {
    return updateArticles(article_id, inc_votes)
      .then(([article]) => {
        res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.postCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (username === undefined) {
    res.status(400).send({ msg: "username not in the request body" });
  }
  if (body === undefined) {
    res.status(400).send({ msg: "comment body not in the request body" });
  }
  if (body === "") {
    res.status(400).send({ msg: "No comment body inside the send body" });
  }

  checkAuthorExists(username)
    .then(user => {
      if (user.length === 0) {
        res.status(404).send({ msg: "username not found" });
      }
    })
    .catch(next);

  checkforArticleId(article_id)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found"
        });
      } else {
        return insertCommentToArticle(article_id, username, body);
      }
    })
    .then(insertedComment => {
      const [comment] = insertedComment;
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  selectArticlesByArticleId(article_id)
    .then(articles => {
      if (articles === undefined) {
        res.status(404).send({ msg: "article_id not found" });
      }
    })
    .catch(next);

  return selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      if (comments.length === 0) {
        res.status(200).send({ comments });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  Promise.all([checkAuthorExists(author), checkTopicExists(topic), order])
    .then(promiseResult => {
      if (promiseResult[0].length === 0) {
        res.status(404).send({ msg: "Author not found in the users table" });
      } else if (promiseResult[1].length === 0) {
        res.status(404).send({ msg: "Topic not found in the topics table" });
      } else if (
        promiseResult[2] !== undefined &&
        (promiseResult[2] !== "asc" || promiseResult[2] !== "desc")
      ) {
        res.status(400).send({ msg: "Invalid order value" });
      } else {
        return selectArticles(sort_by, order, author, topic);
      }
    })
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
