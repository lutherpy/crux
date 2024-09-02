const { body, validationResult } = require("express-validator");
const pool = require("../../../db/DBConnection");

// Middleware de validação
const validateAplicacao = [
  body("name").notEmpty().withMessage("name é obrigatório"),
  body("departamento_id").notEmpty().withMessage("Departamento é obrigatório"),
  body("Servidor").notEmpty().withMessage("Servidor é obrigatório"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ### REQUISIÇÕES ###
// POST AplicacaoS
async function postAplicacoes(req, res) {
  const { name, descricao, departamento_id, servidor } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se o email já existe
    let query = "SELECT COUNT(*) as count FROM Aplicacao WHERE name = $1";
    let result = await client.query(query, [name]);

    if (result.rows[0].count > 0) {
      client.release();
      return res.status(400).json({ error: "A Aplicação já existe" });
    }

    // Inserir o novo Aplicacao
    query = `
      INSERT INTO Aplicacao (name, descricao, departamento_id, createdAt, updatedAt)
      VALUES ($1, $2, $3, DEFAULT, DEFAULT)
    `;
    await client.query(query, [name, descricao, departamento_id]);

    client.release();
    res.status(201).send("Aplicação adicionada com sucesso.");
  } catch (error) {
    console.error("Erro ao adicionar a Aplicação:", error);
    res.status(500).json({ error: "Erro ao adicionar Aplicacao" });
  }
}

// GET Aplicacoes
async function getAplicacoes(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT a.id AS aplicacao_id, a.name AS aplicacao_nome, a.descricao AS aplicacao_descricao, d.nome AS departamento_nome, s.id AS servidor_id, s.nome AS servidor_nome, s.ip_address AS servidor_ip, s.sistema_operacional AS servidor_sistema_operacional FROM aplicacao a LEFT JOIN departamento d ON a.departamento_id = d.id LEFT JOIN aplicacao_servidor aps ON a.id = aps.aplicacao_id LEFT JOIN servidor s ON aps.servidor_id = s.id ORDER BY a.id, s.id"
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao pesquisar Aplicacoes:", error);
    res.status(500).json({ error: "Erro ao pesquisar Aplicacoes" });
  }
}

// GET Aplicacao BY ID
async function getAplicacaoById(req, res) {
  const aplicacaoId = req.params.id;

  try {
    const client = await pool.connect();
    const query =
      "SELECT  a.id AS aplicacao_id, a.name AS aplicacao_nome, a.descricao AS aplicacao_descricao, d.nome AS departamento_nome, s.id AS servidor_id, s.nome AS servidor_nome, s.ip_address AS servidor_ip, s.sistema_operacional AS servidor_sistema_operacional FROM  aplicacao a LEFT JOIN  departamento d ON a.departamento_id = d.id LEFT JOIN  aplicacao_servidor aps ON a.id = aps.aplicacao_id LEFT JOIN  servidor s ON aps.servidor_id = s.id WHERE id = $1";
    const result = await client.query(query, [aplicacaoId]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Aplicacao não encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar Aplicacao por ID:", error);
    res.status(500).json({ error: "Erro ao buscar Aplicacao por ID" });
  }
}

// UPDATE Aplicacao
async function updateAplicacao(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, name, descricao, departamento_id } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se o email já existe para outro Aplicacao
    let query =
      "SELECT COUNT(*) as count FROM Aplicacao WHERE name = $1 AND id != $2";
    let result = await client.query(query, [name, id]);

    if (result.rows[0].count > 0) {
      client.release();
      return res.status(400).json({
        error: "O Nome já está a ser utilizado por outra Aplicacao",
      });
    }

    // Verificar se o name já existe para outro Aplicacao
    query =
      "SELECT COUNT(*) as count FROM Aplicacao WHERE name = $1 AND id != $2";
    result = await client.query(query, [aplicacaoname, id]);

    if (result.rows[0].count > 0) {
      client.release();
      return res.status(400).json({
        error: "O Nome já está a ser utilizado por outra Aplicacao",
      });
    }

    // Atualizar o Aplicacao
    query = `
      UPDATE Aplicacao
      SET name = $1,
          descricao = $2,
          departamento_id = $3,
          updatedAt = DEFAULT
      WHERE id = $4
    `;
    result = await client.query(query, [name, descricao, departamento_id, id]);

    client.release();

    if (result.rowCount > 0) {
      res.status(200).send("Aplicacao atualizada com sucesso.");
    } else {
      res.status(404).send("Aplicacao não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao atualizar Aplicacao:", error);
    res.status(500).json({ error: "Erro ao atualizar Aplicacao" });
  }
}

// DELETE Aplicacao
async function deleteAplicacao(req, res) {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    // Verificar se o Aplicacao existe
    let query = "SELECT COUNT(*) as count FROM Aplicacao WHERE id = $1";
    let result = await client.query(query, [id]);

    if (result.rows[0].count === 0) {
      client.release();
      return res.status(404).json({ error: "Aplicacao não encontrado" });
    }

    // Deletar o Aplicacao
    query = "DELETE FROM Aplicacao WHERE id = $1";
    result = await client.query(query, [id]);

    client.release();
    res.status(200).send("Aplicacao deletada com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar Aplicacao:", error);
    res.status(500).json({ error: "Erro ao deletar Aplicacao" });
  }
}

// DELETE AplicacaoS
async function deleteAplicacoes(req, res) {
  try {
    const client = await pool.connect();

    // Deletar todos os Aplicacaoes
    const query = "DELETE FROM Aplicacao";
    await client.query(query);

    client.release();
    res.status(200).send("Aplicacoes deletados com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar Aplicacoes:", error);
    res.status(500).json({ error: "Erro ao deletar Aplicacaoes" });
  }
}

module.exports = {
  validateAplicacao,
  postAplicacoes,
  getAplicacoes,
  getAplicacaoById,
  updateAplicacao,
  deleteAplicacao,
  deleteAplicacoes,
};
