exports.up = function(knex) {
  console.log("creating topics table...");
  return knex.schema.createTable("topics", topicTable => {
    topicTable.string("slug").primary();
    topicTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("removing topics table...");
  return knex.schema.dropTable("topics");
};
