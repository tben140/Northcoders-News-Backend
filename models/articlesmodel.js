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
  const incValue = inc_votes.inc_votes;
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", incValue)
    .returning("*");
};

exports.insertCommentToArticle = (article_id, username, body) => {
  console.log(
    "In insertCommentToArticle model ...",
    article_id,
    username,
    body
  );

  return connection("comments")
    .insert([{ author: username }, { article_id: article_id }, { body: body }])
    .returning("*");
};

exports.selectCommentsByArticleId = article_id => {};

exports.selectArticles = () => {};
