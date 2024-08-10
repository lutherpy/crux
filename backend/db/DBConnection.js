const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const config = {
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: decodeURIComponent(PGPASSWORD),
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  application_name: ENDPOINT_ID,
};

const pool = new Pool(config);

pool
  .connect()
  .then((client) => {
    console.log("Conectado ao banco de dados Neon PostgreSQL");
    client.release();
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
    throw err;
  });

module.exports = pool;
