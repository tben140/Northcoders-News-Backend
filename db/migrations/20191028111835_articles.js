exports.up = function(knex) {
  console.log("creating articles table...");
  return knex.schema.createTable("articles", articleTable => {
    articleTable
      .increments("article_id")
      .unique()
      .primary();
    articleTable.string("title").notNullable();
    articleTable
      .integer("votes")
      .notNullable()
      .defaultTo(0);
    articleTable.string("topic").references("topics.slug");
    articleTable.string("author").references("users.username");
    articleTable.timestamp("created_at");
  });
};

exports.down = function(knex) {
  console.log("removing articles tables...");
  return knex.schema.dropTable("articles");
};
