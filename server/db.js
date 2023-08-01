const knex = require("knex");

// Configuration object for connecting to PostgreSQL
const dbConfig = {
  client: "pg",
  connection: {
    host: "localhost",
    user: "your name",
    password: "your password",
    database: "db name",
  },
};

// Create a new knex instance with the configuration
const db = knex(dbConfig);

module.exports = { db };
