const { body, validationResult } = require("express-validator");
const pool = require("../../../db/DBConnection");

// Middleware de validação
const validateDepartamento = [
  body("name").notEmpty().withMessage("name é obrigatório"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ### REQUISIÇÕES ###
// POST DepartamentoS
async function postDepartamento(req, res) {
  const { name } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se a aplicação já existe
    let query = "SELECT COUNT(*) as count FROM departamento WHERE name = $1";
    let result = await client.query(query, [name]);

    if (result.rows[0].count > 0) {
      client.release();
      return res.status(400).json({ error: "A Departamento já existe" });
    }

    // Inserir a nova aplicação
    query = `
      INSERT INTO departamento (name, createdAt, updatedAt)
      VALUES ($1, DEFAULT, DEFAULT)
      RETURNING id
    `;
    result = await client.query(query, [name]);

    const departamentoId = result.rows[0].id;

    client.release();
    res.status(201).send("Departamento adicionado com sucesso.");
  } catch (error) {
    console.error("Erro ao adicionar a Departamento:", error);
    res.status(500).json({ error: "Erro ao adicionar Departamento" });
  }
}
// GET Departamentos
async function getDepartamentos(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, name FROM departamento order by id desc"
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao pesquisar Departamentos:", error);
    res.status(500).json({ error: "Erro ao pesquisar Departamentos" });
  }
}

// GET Departamento BY ID
async function getDepartamentoById(req, res) {
  const departamentoId = req.params.id;

  try {
    const client = await pool.connect();
    const query = "SELECT  id, name WHERE a.id = $1";
    const result = await client.query(query, [departamentoId]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Departamento não encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar Departamento por ID:", error);
    res.status(500).json({ error: "Erro ao buscar Departamento por ID" });
  }
}

// UPDATE Departamento
async function updateDepartamento(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, name } = req.body;

  let client;

  try {
    client = await pool.connect();

    // Verificar se o nome já existe para outra aplicação
    let query =
      "SELECT COUNT(*) as count FROM Departamento WHERE name = $1 AND id != $2";
    let result = await client.query(query, [name, id]);

    if (result.rows[0].count > 0) {
      return res.status(400).json({
        error: "O nome já está a ser utilizado por outra aplicação.",
      });
    }

    // Atualizar a aplicação
    query = `
      UPDATE Departamento
      SET name = $1,
          
          updatedAt = DEFAULT
      WHERE id = $4
    `;
    result = await client.query(query, [name, descricao, departamento_id, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Departamento não encontrada." });
    }

    res.status(200).send("Departamento atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar Departamento:", error);
    res.status(500).json({ error: "Erro ao atualizar Departamento" });
  } finally {
    if (client) {
      client.release(); // Garantir que o cliente seja liberado
    }
  }
}

// DELETE Departamento
async function deleteDepartamento(req, res) {
  const { id } = req.params;

  let client;

  try {
    client = await pool.connect();

    // Verificar se a aplicação existe
    let query = "SELECT COUNT(*) as count FROM Departamento WHERE id = $1";
    let result = await client.query(query, [id]);

    if (result.rows[0].count === 0) {
      return res.status(404).json({ error: "Departamento não encontrada" });
    }

    // Deletar registros relacionados na tabela departamento_servidor
    query = "DELETE FROM departamento WHERE id = $1";
    await client.query(query, [id]);

    // Deletar a aplicação
    query = "DELETE FROM Departamento WHERE id = $1";
    const deleteResult = await client.query(query, [id]);

    // Verificar se a aplicação foi deletada
    if (deleteResult.rowCount > 0) {
      res.status(200).send("Departamento deletada com sucesso.");
    } else {
      res.status(500).json({ error: "Erro ao deletar Departamento" });
    }
  } catch (error) {
    console.error("Erro ao deletar Departamento:", error);
    res.status(500).json({ error: "Erro ao deletar Departamento" });
  } finally {
    if (client) {
      client.release(); // Garantir que o cliente seja liberado
    }
  }
}

// DELETE DepartamentoS
async function deleteDepartamentos(req, res) {
  try {
    const client = await pool.connect();

    // Deletar todos os Departamentoes
    const query = "DELETE FROM Departamento";
    await client.query(query);

    client.release();
    res.status(200).send("Departamentos deletados com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar Departamentos:", error);
    res.status(500).json({ error: "Erro ao deletar Departamentoes" });
  }
}

module.exports = {
  validateDepartamento,
  postDepartamento,
  getDepartamentos,
  getDepartamentoById,
  updateDepartamento,
  deleteDepartamento,
  deleteDepartamentos,
};
