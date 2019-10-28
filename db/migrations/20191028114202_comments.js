exports.up = function(knex) {
  console.log("creating comments table...");
  return knex.schema.createTable("comments", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentTable
      .integer("article")
      .references("articles.article_id")
      .notNullable();
    commentTable
      .integer("votes")
      .notNullable()
      .defaultTo(0);
    commentTable
      .timestamp("created_at")
      .defaultTo(knex.fn.now())
      .notNullable();
    commentTable.string("body").notNullable();
  });
};

exports.down = function(knex) {
  console.log("removing comments tables...");
  return knex.schema.dropTable("comments");
};
