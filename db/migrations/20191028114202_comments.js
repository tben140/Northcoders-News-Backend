exports.up = function(knex) {
  console.log("creating comments table...");
  return knex.schema.createTable("comments", commentTable => {
    commentTable
      .increments("comment_id")
      .unique()
      .primary();
    commentTable.string("author").references("users.username");
    commentTable.integer("article").references("articles.article_id");
    commentTable
      .integer("votes")
      .notNullable()
      .defaultTo(0);
    commentTable.timestamp("created_at");
    commentTable.string("body");
  });
};

exports.down = function(knex) {
  console.log("removing comments tables...");
  return knex.schema.dropTable("comments");
};
