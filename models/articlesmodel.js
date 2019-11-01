const connection = require("../dbconnection.js");

exports.selectArticlesByArticleId = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(([articles]) => {
      return articles;
    });
};

exports.updateArticles = (article_id, inc_votes) => {
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*");
};

exports.insertCommentToArticle = (article_id, username, body) => {
  // console.log(
  //   "In insertCommentToArticle model ...",
  //   article_id,
  //   username,
  //   body
  // );

  return connection("comments")
    .insert([{ author: username, article_id: article_id, body: body }])
    .returning("*");
};

exports.selectCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where("comments.article_id", article_id)
    .modify(query => {
      if (sort_by) {
        query.orderBy(sort_by, order);
      }
    });
};

exports.selectArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return connection
    .select("articles.*")
    .count("comment_id", { as: "comment_count" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      if (sort_by) {
        query.orderBy(sort_by, order);
      }
      if (author) {
        query.where("articles.author", "=", author);
      }
      if (topic) {
        query.where("topic", "=", topic);
      }
    });
};
