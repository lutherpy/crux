CREATE DATABASE sirius;

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