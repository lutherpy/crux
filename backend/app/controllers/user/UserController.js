const { body, validationResult } = require("express-validator");
const pool = require("../../../db/DBConnection");
const bcrypt = require("bcrypt");

// Middleware de validação
const validateUser = [
  body("username").notEmpty().withMessage("Username é obrigatório"),
  body("email").notEmpty().withMessage("Email obrigatório"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Password obrigatória"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ### REQUISIÇÕES ###
// POST USERS
async function postUsers(req, res) {
  const { username, name, email, password, departamento, perfil } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se o email já existe
    let query = "SELECT COUNT(*) as count FROM Utilizador WHERE email = $1";
    let result = await client.query(query, [email]);

    if (result.rows[0].count > 0) {
      client.release();
      return res.status(400).json({ error: "O Email já está a ser utilizado" });
    }

    // Verificar se o username já existe
    query = "SELECT COUNT(*) as count FROM Utilizador WHERE username = $1";
    result = await client.query(query, [username]);

    if (result.rows[0].count > 0) {
      client.release();
      return res
        .status(400)
        .json({ error: "O Username já está a ser utilizado" });
    }

    // Criptografar a password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir o novo utilizador
    query = `
      INSERT INTO Utilizador (username, name, email, password, perfil, departamento, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, DEFAULT, DEFAULT) RETURNING id
    `;
    const insertResult = await client.query(query, [
      username,
      name,
      email,
      hashedPassword,
      perfil,
      departamento,
    ]);

    // Obter o ID do utilizador recém-adicionado
    const utilizadorId = insertResult.rows[0].id;

    // Inserir na tabela Utilizador_Departamento
    if (departamento) {
      query = `
        INSERT INTO Utilizador_Departamento (utilizador_id, departamento_id)
        VALUES ($1, $2)
      `;
      await client.query(query, [utilizadorId, departamento]);
    }

    client.release();
    res.status(201).send("Utilizador adicionado com sucesso.");
  } catch (error) {
    console.error("Erro ao adicionar Utilizador:", error);
    res.status(500).json({ error: "Erro ao adicionar Utilizador" });
  }
}

// GET USERS
async function getUsers(req, res) {
  const userDepartamento = req.user.departamento;
  const userPerfil = req.user.perfil; // Assumindo que o perfil também está no JWT

  try {
    const client = await pool.connect();

    // Filtrar por departamento apenas se o perfil for USER
    let query;
    let params;

    if (userPerfil === 1) {
      // admin
      query = `
        SELECT u.id AS id, u.name AS name, u.username AS username, u.email AS email, u.password AS password, u.departamento AS departamento_id, u.perfil AS perfil_id, d.name AS departamento, p.name AS perfil 
        FROM utilizador u 
        LEFT JOIN departamento d ON u.departamento = d.id 
        LEFT JOIN perfil p ON u.perfil = p.id;
      `;
      params = [];
    } else if (userPerfil === 2) {
      // user
      query = `
        SELECT u.id AS id, u.name AS name, u.username AS username, u.email AS email, u.password AS password, u.departamento AS departamento_id, u.perfil AS perfil_id, d.name AS departamento, p.name AS perfil 
        FROM utilizador u 
        LEFT JOIN departamento d ON u.departamento = d.id 
        LEFT JOIN perfil p ON u.perfil = p.id 
        WHERE u.departamento = $1;
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
    console.error("Erro ao pesquisar Utilizadores:", error);
    res.status(500).json({ error: "Erro ao pesquisar Utilizadores" });
  }
}

// GET USER BY ID
async function getUserById(req, res) {
  const userId = req.params.id;

  try {
    const client = await pool.connect();
    const query =
      "SELECT u.id AS id, u.name AS name, u.username AS username, u.email AS email, u.password AS password, u.departamento AS departamento, u.perfil AS perfil, d.name AS departamento_d, p.name AS perfil_p FROM utilizador u LEFT JOIN departamento d ON u.departamento = d.id LEFT JOIN perfil p ON u.perfil = p.id WHERE u.id = $1";
    const result = await client.query(query, [userId]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar Utilizador por ID:", error);
    res.status(500).json({ error: "Erro ao buscar Utilizador por ID" });
  }
}

// UPDATE USER
async function updateUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, username, name, email, perfil, departamento } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se o email já existe para outro utilizador
    let query =
      "SELECT COUNT(*) as count FROM Utilizador WHERE email = $1 AND id != $2";
    let result = await client.query(query, [email, id]);

    if (result.rows[0].count > 0) {
      client.release();
      return res.status(400).json({
        error: "O Email já está a ser utilizado por outro Utilizador",
      });
    }

    // Verificar se o username já existe para outro utilizador
    query =
      "SELECT COUNT(*) as count FROM Utilizador WHERE username = $1 AND id != $2";
    result = await client.query(query, [username, id]);

    if (result.rows[0].count > 0) {
      client.release();
      return res.status(400).json({
        error: "O Username já está a ser utilizado por outro Utilizador",
      });
    }

    // Verificar se o perfil existe
    query = "SELECT COUNT(*) as count FROM perfil WHERE id = $1";
    result = await client.query(query, [perfil]);

    if (result.rows[0].count === 0) {
      client.release();
      return res.status(400).json({ error: "O perfil não existe" });
    }

    // Atualizar o utilizador
    query = `
      UPDATE Utilizador
      SET username = $1,
          name = $2,
          email = $3,
          perfil = $4,
          departamento = $5,
          updatedAt = DEFAULT
      WHERE id = $6
    `;
    result = await client.query(query, [
      username,
      name,
      email,
      perfil,
      departamento,
      id,
    ]);

    // Atualizar ou inserir na tabela Utilizador_Departamento
    if (departamento) {
      query = `
        INSERT INTO Utilizador_Departamento (utilizador_id, departamento_id)
        VALUES ($1, $2)
        ON CONFLICT (utilizador_id, departamento_id)
        DO NOTHING
      `;
      await client.query(query, [id, departamento]);

      // Remover qualquer associação existente do usuário ao departamento
      query = `
        DELETE FROM Utilizador_Departamento
        WHERE utilizador_id = $1
        AND departamento_id != $2
      `;
      await client.query(query, [id, departamento]);
    } else {
      query = `
        DELETE FROM Utilizador_Departamento
        WHERE utilizador_id = $1
      `;
      await client.query(query, [id]);
    }

    client.release();

    if (result.rowCount > 0) {
      res.status(200).send("Utilizador atualizado com sucesso.");
    } else {
      res.status(404).send("Utilizador não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao atualizar Utilizador:", error);
    res.status(500).json({ error: "Erro ao atualizar Utilizador" });
  }
}

// UPDATE PASSWORD
async function updatePassword(req, res) {
  const { id, password } = req.body;

  try {
    const client = await pool.connect();

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar a senha do usuário
    const query = "UPDATE Utilizador SET password = $1 WHERE id = $2";
    const result = await client.query(query, [hashedPassword, id]);

    client.release();

    if (result.rowCount > 0) {
      res.status(200).send("Senha do usuário atualizada com sucesso.");
    } else {
      res.status(404).send("Usuário não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao atualizar senha do usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar senha do usuário" });
  }
}

// DELETE USER
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    // Iniciar uma transação
    await client.query("BEGIN");

    // Verificar se o utilizador existe
    let query = "SELECT COUNT(*) as count FROM Utilizador WHERE id = $1";
    let result = await client.query(query, [id]);

    if (result.rows[0].count === 0) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    // Deletar o utilizador da tabela Utilizador_Departamento
    query = "DELETE FROM Utilizador_Departamento WHERE utilizador_id = $1";
    await client.query(query, [id]);

    // Deletar o utilizador da tabela Utilizador
    query = "DELETE FROM Utilizador WHERE id = $1";
    await client.query(query, [id]);

    // Commitar a transação
    await client.query("COMMIT");
    client.release();
    res.status(200).send("Utilizador deletado com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar Utilizador:", error);
    await client.query("ROLLBACK");
    client.release();
    res.status(500).json({ error: "Erro ao deletar Utilizador" });
  }
}

// DELETE USERS
async function deleteUsers(req, res) {
  try {
    const client = await pool.connect();

    // Deletar todos os utilizadores
    const query = "DELETE FROM Utilizador";
    await client.query(query);

    client.release();
    res.status(200).send("Utilizadores deletados com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar Utilizadores:", error);
    res.status(500).json({ error: "Erro ao deletar Utilizadores" });
  }
}

// TEST CONNECTION
async function testConnection(req, res) {
  try {
    const client = await pool.connect();
    client.release();
    res
      .status(200)
      .send("Connection to the PostgreSQL database was successful.");
  } catch (error) {
    console.error(
      "Error testing connection to the PostgreSQL database:",
      error
    );
    res
      .status(500)
      .json({ error: "Error testing connection to the PostgreSQL database" });
  }
}

module.exports = {
  validateUser,
  postUsers,
  getUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
  deleteUsers,
  testConnection,
};
