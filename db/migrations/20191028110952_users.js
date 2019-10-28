exports.up = function(knex) {
  console.log("creating users table...");
  return knex.schema.createTable("users", userTable => {
    userTable
      .string("username")
      .unique()
      .primary();
    userTable.string("avatar_url");
    userTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  console.log("removing users tables...");
  return knex.schema.dropTable("users");
};
