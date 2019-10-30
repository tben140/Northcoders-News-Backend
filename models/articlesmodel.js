const connection = require("../dbconnection.js");

exports.selectArticles = article_id => {
  // console.log("In selectArticles model ...");
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(([articles]) => {
      // console.log("Articles after Knex statement destructured ->", articles);
      return articles;
    });
};
