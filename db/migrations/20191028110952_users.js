exports.up = function(knex) {
  console.log("creating users table...");
  return knex.schema.createTable("users", userTable => {
    userTable.string("username").primary();
    userTable.string("avatar_url").notNullable();
    userTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  console.log("removing users tables...");
  return knex.schema.dropTable("users");
};
