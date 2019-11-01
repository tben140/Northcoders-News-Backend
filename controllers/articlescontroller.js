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
    res.status(400).send({ msg: "No inc_votes on request body" });
  } else if (Object.keys(req.body).length > 1) {
    res.status(400).send({ msg: "Other property on the request body" });
  } else {
    return updateArticles(article_id, inc_votes)
      .then(article => {
        const [articleObj] = article;
        res.status(201).send({ articleObj });
      })
      .catch(next);
  }
};

exports.postCommentToArticle = (req, res, next) => {
  // console.log("In postCommentToArticle controller...");

  const { article_id } = req.params;
  const { username, body } = req.body;
  // console.log("article_id, username, body", article_id, username, body);

  return insertCommentToArticle(article_id, username, body)
    .then(comments => {
      // console.log("comments before send ->", comments);
      res.status(201).send({ comments });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  // console.log("Inside getCommentsByArticleId ->");

  return selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      if (comments.length === 0) {
        res.status(404).send({ msg: "article_id not found" });
      } else {
        res.status(200).send({ comments });
      }
    })
    .catch(next);
};

// exports.getArticles = (req, res, next) => {
//   // console.log("Inside getArticles controller...");
//   const { sort_by, order, author, topic } = req.query;

//   return selectArticles(sort_by, order, author, topic)
//     .then(articles => {

//       if (author === undefined && topic === undefined) {

//       }

//       if (author !== undefined && topic === undefined) {

//       }

//       if (author !== undefined && topic !== undefined) {
//       }

//       if (!articles.length) {
//         return Promise.all([articles, getUsers(author)]);
//       } else {
//         return [articles];
//       }

//     })
//     .then(() => {
//       res.status(200).send({ articles });
//     })
//     .catch(next);
//   // }
// };

exports.getArticles = (req, res, next) => {
  // console.log("Inside getArticles controller...");
  const { sort_by, order, author, topic } = req.query;

  return selectArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
  // }
};
