const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { PGHOST, PGUSER, PGPASSWORD, PGPORT, ENDPOINT_ID } = process.env;

const config = {
  host: PGHOST,
  user: PGUSER,
  password: decodeURIComponent(PGPASSWORD),
  port: PGPORT || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  application_name: ENDPOINT_ID,
};

const pool = new Pool(config);

async function createDatabaseAndTables() {
  try {
    // Connect to the default database to create SIRIUS if it doesn't exist
    const client = await pool.connect();

    const checkDatabaseQuery = `
      SELECT 1 FROM pg_database WHERE datname = 'sirius';
    `;
    const res = await client.query(checkDatabaseQuery);

    if (res.rowCount === 0) {
      await client.query("CREATE DATABASE sirius;");
      console.log("Database 'sirius' created.");
    } else {
      console.log("Database 'sirius' already exists.");
    }

    client.release();

    // Connect to the SIRIUS database to create tables
    const siriusConfig = { ...config, database: "sirius" };
    const siriusPool = new Pool(siriusConfig);
    const siriusClient = await siriusPool.connect();

    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS Profile (
        id SERIAL PRIMARY KEY,
        descricao VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Utilizador (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        pass VARCHAR(255) NOT NULL,
        profile_id INT REFERENCES Profile(id)
      );

      CREATE TABLE IF NOT EXISTS TiposDeEntidade (
        id SERIAL PRIMARY KEY,
        descricao VARCHAR(255) NOT NULL,
        sigla VARCHAR(50) NOT NULL
      );

      INSERT INTO NewTable (descricao, sigla) VALUES 
        ('Sociedades Gestoras de Mercados Regulamentados', 'SGRM'),
        ('Sociedades Gestoras de Organismos de Investimento Coletivo', 'SGOIC'),
        ('Organismos de Investimento Coletivo', 'OIC'),
        ('Sociedades Corretoras de Valores Mobiliários', 'SCVM'),
        ('Peritos Avaliadores de Imóveis de Organismos de Investimento Coletivo', 'PAIOIC'),
        ('Entidade Certificadora de Peritos Avaliadores de Imóveis', 'ECPAI'),
        ('Bancos', 'B'),
        ('Auditores Externos', 'AE'),
        ('Sociedades Distribuidoras de Valores Mobiliários', 'SDVM'),
        ('Consultores para Investimento e Analistas Financeiros', 'CIAF'),
        ('Sociedades de Capital de Risco', 'SCR')
      ON CONFLICT DO NOTHING;
    `;

    await siriusClient.query(createTablesQuery);
    console.log("Tables checked/created.");

    siriusClient.release();
    await siriusPool.end();
  } catch (err) {
    console.error("Error creating database or tables:", err);
  } finally {
    await pool.end();
  }
}

createDatabaseAndTables();
