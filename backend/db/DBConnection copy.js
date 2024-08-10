// db/DBConnection.js

const sql = require("mssql");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  server: process.env.PGHOST,
  database: process.env.PGDATABASE,
  options: {
    encrypt: false, // Se necessário, ajuste conforme sua configuração de segurança
    enableArithAbort: true,
  },
};

// Criação de pool de conexão
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Conectado ao banco de dados SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};
