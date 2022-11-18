const Pool = require("pg").Pool;

const connection = new Pool({
  host: "localhost",
  user: "ISI USER",
  password: "ISI PASSWORD",
  database: "challenge5",
  port: 5432,
});

module.exports = connection;
