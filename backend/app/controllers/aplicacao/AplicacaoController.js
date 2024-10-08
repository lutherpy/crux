const { body, validationResult } = require("express-validator");
const pool = require("../../../db/DBConnection");

// Middleware de validação
const validateAplicacao = [
  body("name").notEmpty().withMessage("name é obrigatório"),
  body("departamento").notEmpty().withMessage("Departamento é obrigatório"),
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
  const { name, descricao, departamento, servidor } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se a aplicação já existe
    let query = "SELECT COUNT(*) as count FROM aplicacao WHERE name = $1";
    let result = await client.query(query, [name]);

    if (result.rows[0].count > 0) {
      client.release();
      return res.status(400).json({ error: "A Aplicação já existe" });
    }

    // Inserir a nova aplicação
    query = `
      INSERT INTO aplicacao (name, descricao, departamento, servidor, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, DEFAULT, DEFAULT) RETURNING id
    `;
    result = await client.query(query, [
      name,
      descricao,
      departamento,
      servidor || null, // Tratar servidor como null se não for fornecido
    ]);

    // Obter o ID da aplicação recém-adicionada
    const aplicacaoId = result.rows[0].id;

    // Associar a aplicação a servidores na tabela aplicacao_servidor
    if (servidor) {
      query = `
        INSERT INTO aplicacao_servidor (aplicacao_id, servidor_id)
        VALUES ($1, $2)
      `;
      await client.query(query, [aplicacaoId, servidor]);
    }

    client.release();
    res.status(201).send("Aplicação adicionada com sucesso.");
  } catch (error) {
    console.error("Erro ao adicionar a Aplicação:", error);
    res.status(500).json({ error: "Erro ao adicionar Aplicação" });
  }
}

// GET Aplicacoes
async function getAplicacoes(req, res) {
  const userDepartamento = req.user.departamento;
  const userPerfil = req.user.perfil; // Assumindo que o perfil também está no JWT

  try {
    const client = await pool.connect();

    let query;
    let params;

    if (userPerfil === 1) {
      // admin
      query = `
        SELECT a.id as id, a.name AS name, a.descricao, a.departamento, a.servidor AS servidor, d.name AS departamento_name, s.name AS servidor_name 
        FROM aplicacao a 
        LEFT JOIN departamento d ON a.departamento = d.id 
        LEFT JOIN aplicacao_servidor aps ON a.id = aps.aplicacao_id 
        LEFT JOIN servidor s ON aps.servidor_id = s.id 
        ORDER BY a.id DESC
      `;
      params = [];
    } else if (userPerfil === 2) {
      // user
      query = `
        SELECT a.id as id, a.name AS name, a.descricao, a.departamento, a.servidor AS servidor, d.name AS departamento_name, s.name AS servidor_name 
        FROM aplicacao a 
        LEFT JOIN departamento d ON a.departamento = d.id 
        LEFT JOIN aplicacao_servidor aps ON a.id = aps.aplicacao_id 
        LEFT JOIN servidor s ON aps.servidor_id = s.id 
        WHERE a.departamento = $1
        ORDER BY a.id DESC
      `;
      params = [userDepartamento];
    } else {
      // Se o perfil não for reconhecido
      client.release();
      return res
        .status(403)
        .json({ error: "Perfil do usuário não autorizado." });
    }

    const result = await client.query(query, params);
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
      "SELECT  a.id AS id, a.name AS name, a.descricao AS descricao, a.servidor AS servidor, a.departamento AS departamento, d.name AS departamento_d, s.id AS servidor_id, s.name AS servidor_name, s.ip_address AS servidor_ip, s.sistema_operacional AS servidor_sistema_operacional FROM  aplicacao a LEFT JOIN  departamento d ON a.departamento = d.id LEFT JOIN  aplicacao_servidor aps ON a.id = aps.aplicacao_id LEFT JOIN  servidor s ON aps.servidor_id = s.id WHERE a.id = $1";
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

  const { id, name, descricao, departamento, servidor } = req.body;

  let client;

  try {
    client = await pool.connect();

    // Verificar se o nome já existe para outra aplicação
    let query =
      "SELECT COUNT(*) as count FROM aplicacao WHERE name = $1 AND id != $2";
    let result = await client.query(query, [name, id]);

    if (result.rows[0].count > 0) {
      return res.status(400).json({
        error: "O nome já está a ser utilizado por outra aplicação.",
      });
    }

    // Atualizar a aplicação
    query = `
      UPDATE aplicacao
      SET name = $1,
          descricao = $2,
          departamento = $3,
          servidor = $4,
          updatedAt = DEFAULT
      WHERE id = $5
    `;
    result = await client.query(query, [
      name,
      descricao,
      departamento,
      servidor || null, // Garantir que o servidor seja tratado como null se não fornecido
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Aplicação não encontrada." });
    }

    // Atualizar a relação entre aplicação e servidores na tabela aplicacao_servidor
    // Remover todas as associações existentes
    query = `
      DELETE FROM aplicacao_servidor WHERE aplicacao_id = $1;
    `;
    await client.query(query, [id]);

    // Adicionar as novas associações
    if (servidor) {
      query = `
        INSERT INTO aplicacao_servidor (aplicacao_id, servidor_id)
        VALUES ($1, $2)
        ON CONFLICT (aplicacao_id, servidor_id) DO NOTHING
      `;
      await client.query(query, [id, servidor]);
    }

    res.status(200).send("Aplicação atualizada com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar Aplicação:", error);
    res.status(500).json({ error: "Erro ao atualizar Aplicação" });
  } finally {
    if (client) {
      client.release(); // Garantir que o cliente seja liberado
    }
  }
}

// DELETE Aplicacao
async function deleteAplicacao(req, res) {
  const { id } = req.params;

  let client;

  try {
    client = await pool.connect();

    // Verificar se a aplicação existe
    let query = "SELECT COUNT(*) as count FROM Aplicacao WHERE id = $1";
    let result = await client.query(query, [id]);

    if (result.rows[0].count === 0) {
      return res.status(404).json({ error: "Aplicação não encontrada" });
    }

    // Deletar registros relacionados na tabela aplicacao_servidor
    query = "DELETE FROM aplicacao_servidor WHERE aplicacao_id = $1";
    await client.query(query, [id]);

    // Deletar a aplicação
    query = "DELETE FROM Aplicacao WHERE id = $1";
    const deleteResult = await client.query(query, [id]);

    // Verificar se a aplicação foi deletada
    if (deleteResult.rowCount > 0) {
      res.status(200).send("Aplicação deletada com sucesso.");
    } else {
      res.status(500).json({ error: "Erro ao deletar Aplicação" });
    }
  } catch (error) {
    console.error("Erro ao deletar Aplicação:", error);
    res.status(500).json({ error: "Erro ao deletar Aplicação" });
  } finally {
    if (client) {
      client.release(); // Garantir que o cliente seja liberado
    }
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
