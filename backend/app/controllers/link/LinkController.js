const { body, validationResult } = require("express-validator");
const pool = require("../../../db/DBConnection");

// Middleware de validação
const validateLink = [
  body("name").notEmpty().withMessage("name é obrigatório"),
  body("link").notEmpty().withMessage("link é obrigatório"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ### REQUISIÇÕES ###
// POST LinkS
async function postLink(req, res) {
  const { name, servico, link, departamento } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se a aplicação já existe
    let query = "SELECT COUNT(*) as count FROM link WHERE name = $1";
    let result = await client.query(query, [name]);

    if (result.rows[0].count > 0) {
      client.release();
      return res.status(400).json({ error: "O Link já existe" });
    }

    // Inserir a nova aplicação
    query = `
      INSERT INTO link (name, servico, link, departamento, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, DEFAULT, DEFAULT)
      RETURNING id
    `;
    result = await client.query(query, [name, servico, link, departamento]);

    const linkId = result.rows[0].id;

    client.release();
    res.status(201).send("Link adicionado com sucesso.");
  } catch (error) {
    console.error("Erro ao adicionar a Link:", error);
    res.status(500).json({ error: "Erro ao adicionar Link" });
  }
}
// GET Links
async function getLinks(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT l.id AS id, l.link, l.name AS name, l.servico AS servico, l.departamento AS departamento, d.name AS departamento_geral FROM link l JOIN departamentos_gerais d ON l.departamento = d.id;"
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao pesquisar Links:", error);
    res.status(500).json({ error: "Erro ao pesquisar Links" });
  }
}

// GET Link BY ID
async function getLinkById(req, res) {
  const linkId = req.params.id;

  try {
    const client = await pool.connect();
    const query =
      "SELECT l.id AS id, l.name AS name, l.servico AS servico, l.link, l.departamento AS departamento, d.name AS departamento_geral FROM link l JOIN departamentos_gerais d ON l.departamento = d.id WHERE l.id = $1;";

    const result = await client.query(query, [linkId]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Link não encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar Link por ID:", error);
    res.status(500).json({ error: "Erro ao buscar Link por ID" });
  }
}

// UPDATE Link
async function updateLink(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, name, servico, link, departamento } = req.body;

  let client;

  try {
    client = await pool.connect();

    // Verificar se o nome já existe para outra aplicação
    let query =
      "SELECT COUNT(*) as count FROM Link WHERE name = $1 AND id != $2";
    let result = await client.query(query, [name, id]);

    if (result.rows[0].count > 0) {
      return res.status(400).json({
        error: "O nome já está a ser utilizado por outra aplicação.",
      });
    }

    // Atualizar a aplicação
    query = `
      UPDATE Link
      SET name = $1,
       servico = $2,
       link = $3,
       departamento = $4, 
          updatedAt = DEFAULT
      WHERE id = $5
    `;
    result = await client.query(query, [name, servico, link, departamento, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Link não encontrado." });
    }

    res.status(200).send("Link atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar Link:", error);
    res.status(500).json({ error: "Erro ao atualizar Link" });
  } finally {
    if (client) {
      client.release(); // Garantir que o cliente seja liberado
    }
  }
}

// DELETE Link
async function deleteLink(req, res) {
  const { id } = req.params;

  let client;

  try {
    client = await pool.connect();

    // Verificar se a aplicação existe
    let query = "SELECT COUNT(*) as count FROM Link WHERE id = $1";
    let result = await client.query(query, [id]);

    if (result.rows[0].count === 0) {
      return res.status(404).json({ error: "Link não encontrado" });
    }

    // Deletar registros relacionados na tabela link_servidor
    query = "DELETE FROM link WHERE id = $1";
    await client.query(query, [id]);

    // Deletar a aplicação
    query = "DELETE FROM Link WHERE id = $1";
    const deleteResult = await client.query(query, [id]);

    // Verificar se a aplicação foi deletada
    if (deleteResult.rowCount > 0) {
      res.status(200).send("Link deletado com sucesso.");
    } else {
      res.status(500).json({ error: "Erro ao deletar Link" });
    }
  } catch (error) {
    console.error("Erro ao deletar Link:", error);
    res.status(500).json({ error: "Erro ao deletar Link" });
  } finally {
    if (client) {
      client.release(); // Garantir que o cliente seja liberado
    }
  }
}

// DELETE LinkS
async function deleteLinks(req, res) {
  try {
    const client = await pool.connect();

    // Deletar todos os Linkes
    const query = "DELETE FROM Link";
    await client.query(query);

    client.release();
    res.status(200).send("Links deletados com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar Links:", error);
    res.status(500).json({ error: "Erro ao deletar Linkes" });
  }
}

module.exports = {
  validateLink,
  postLink,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink,
  deleteLinks,
};
