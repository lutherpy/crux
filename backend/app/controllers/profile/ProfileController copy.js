// controllers/Profile.js
const { body, validationResult } = require("express-validator");
const { sql, poolPromise } = require("../../../db/DBConnection");

// Middleware de validação
const validateProfile = [
  body("descricao").notEmpty().withMessage("Descrição é obrigatória"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Chame `next()` para passar para o próximo middleware ou rota
    next();
  },
];
// ### REQUISIÇÕES ###
// POST USERS
async function postProfiles(req, res) {
  // Executar as validações

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { descricao } = req.body;

  try {
    const pool = await poolPromise; // Obter o pool de conexão do DBConnection.js

    // Verificar se já existe
    let query =
      "SELECT COUNT(*) as count FROM Profile WHERE descricao = @Descricao";
    let result = await pool
      .request()
      .input("Descricao", sql.VarChar, descricao)
      .query(query);

    if (result.recordset[0].count > 0) {
      return res
        .status(400)
        .json({ error: "O Perfil já está a ser utilizado" });
    }

    // Inserir o novo perfil
    query = `
            INSERT INTO Profile (descricao)
            VALUES (@descricao);
        `;

    await pool
      .request()
      .input("descricao", sql.VarChar, descricao)

      .query(query);

    res.status(201).send("Profile adicionado com sucesso."); // Responder com sucesso
  } catch (error) {
    console.error("Erro ao adicionar Profile:", error);
    res.status(500).json({ error: "Erro ao adicionar Profile" });
  }
}

//GET USERS
async function getProfiles(req, res) {
  try {
    const pool = await poolPromise; // Obter o pool de conexão do DBConnection.js
    const result = await pool
      .request()
      .query("SELECT * FROM Profile ORDER BY id DESC"); // Executar a consulta SQL usando pool.request()
    res.status(200).json(result.recordset); // Retornar os utilizadores como JSON
  } catch (error) {
    console.error("Erro ao pesquisar Profiles:", error);
    res.status(500).json({ error: "Erro ao pesquisar Profiles" });
  }
}
//GET USER BY ID
async function getProfileById(req, res) {
  const userId = req.params.id; // Captura o parâmetro ID da URL

  try {
    const pool = await poolPromise; // Obter o pool de conexão do DBConnection.js

    // Consulta SQL para buscar o usuário pelo ID
    const query = "SELECT * FROM Profile WHERE id = @userId";
    const result = await pool
      .request()
      .input("profileId", sql.Int, profileId)
      .query(query);

    // Verifica se o usuário foi encontrado
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Profile não encontrado" });
    }

    // Retorna o usuário encontrado como JSON
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Erro ao buscar Profile por ID:", error);
    res.status(500).json({ error: "Erro ao buscar Profile por ID" });
  }
}
//UPDATE USER
async function updateProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, descricao } = req.body;

  try {
    const pool = await poolPromise; // Obter o pool de conexão do DBConnection.js

    // Verificar se já existe para outro utilizador
    let query =
      "SELECT COUNT(*) as count FROM Profile WHERE descricao = @Descricao AND id != @Id";
    let result = await pool
      .request()
      .input("Descricao", sql.VarChar, descricao)
      .input("Id", sql.Int, id)
      .query(query);

    if (result.recordset[0].count > 0) {
      return res.status(400).json({
        error: "O Nome já está a ser utilizado por outro Profile",
      });
    }

    // Atualizar o perfil
    query = `
            UPDATE Profile
            SET descricao = @descricao
                
            WHERE id = @id;
        `;

    result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("descricao", sql.VarChar, descricao)

      .query(query);

    if (result.rowsAffected[0] > 0) {
      res.status(200).send("Profile atualizado com sucesso.");
    } else {
      res.status(404).send("Profile não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao atualizar Profile:", error);
    res.status(500).json({ error: "Erro ao atualizar Profile" });
  }
}

//DELETE USER
async function deleteProfile(req, res) {
  const { id } = req.params;

  try {
    const pool = await poolPromise; // Obter o pool de conexão do DBConnection.js

    // Verificar se o utilizador existe
    let query = "SELECT COUNT(*) as count FROM Profile WHERE id = @Id";
    let result = await pool.request().input("Id", sql.Int, id).query(query);

    if (result.recordset[0].count === 0) {
      return res.status(404).json({ error: "Profile não encontrado" });
    }

    // Deletar o utilizador
    query = "DELETE FROM Profile WHERE id = @Id";
    result = await pool.request().input("Id", sql.Int, id).query(query);

    res.status(200).send("Profile deletado com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar Profile:", error);
    res.status(500).json({ error: "Erro ao deletar Profile" });
  }
}

//DELETE USERS
async function deleteProfiles(req, res) {
  const { id } = req.params;

  try {
    const pool = await poolPromise; // Obter o pool de conexão do DBConnection.js
    // Deletar todos os utilizadores
    query = "DELETE FROM Profile";
    result = await pool.request().query(query);

    res.status(200).send("Profiles deletados com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar Profiles:", error);
    res.status(500).json({ error: "Erro ao deletar Profiles" });
  }
}

// TESTAR PASS

module.exports = {
  postProfiles,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  deleteProfiles,
  validateProfile,
};
