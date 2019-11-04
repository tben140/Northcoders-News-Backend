const {
  selectArticlesByArticleId,
  updateArticles,
  insertCommentToArticle,
  selectCommentsByArticleId,
  selectArticles,
  checkAuthorExists
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

  return insertCommentToArticle(article_id, username, body)
    .then(insertedComment => {
      // console.log("insertedComment ->", insertedComment);
      // if (insertedComment.length === 0) {
      //   res.status(404).send({ msg: "article_id not found" });
      // }
      const [comment] = insertedComment;
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  return selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      if (comments.length === 0) {
        res.status(404).send({ msg: "article_id not found" });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  checkAuthorExists(author)
    .then(authorCheck => {
      if (authorCheck.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No articles found for author"
        });
      } else {
        return selectArticles(sort_by, order, author, topic);
      }
    })
    .then(topicCheck => {})
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);

  // return selectArticles(sort_by, order, author, topic)
  //   .then(articles => {
  //     res.status(200).send({ articles });
  //   })
  //   .catch(next);
};
