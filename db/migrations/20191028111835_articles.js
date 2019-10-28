exports.up = function(knex) {
  console.log("creating articles table...");
  return knex.schema.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable
      .integer("votes")
      .notNullable()
      .defaultTo(0);
    articleTable
      .string("topic")
      .references("topics.slug")
      .notNullable();
    articleTable
      .string("author")
      .references("users.username")
      .notNullable();
    articleTable
      .timestamp("created_at")
      .defaultTo(knex.fn.now())
      .notNullable();
  });
};

exports.down = function(knex) {
  console.log("removing articles tables...");
  return knex.schema.dropTable("articles");
};
