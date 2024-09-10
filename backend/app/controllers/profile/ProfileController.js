const { body, validationResult } = require("express-validator");
const pool = require("../../../db/DBConnection");

// Middleware de validação
const validateProfile = [
  body("name").notEmpty().withMessage("Descrição é obrigatória"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// POST PROFILE
async function postProfiles(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se já existe
    let query = "SELECT COUNT(*) as count FROM perfil WHERE name = $1";
    let result = await client.query(query, [name]);

    if (result.rows[0].count > 0) {
      return res
        .status(400)
        .json({ error: "O Perfil já está a ser utilizado" });
    }

    // Inserir o novo perfil
    query = "INSERT INTO perfil (name) VALUES ($1)";

    await client.query(query, [name]);

    res.status(201).send("Profile adicionado com sucesso.");
    client.release();
  } catch (error) {
    console.error("Erro ao adicionar Profile:", error);
    res.status(500).json({ error: "Erro ao adicionar Profile" });
  }
}

// GET PROFILES
async function getProfiles(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM perfil ORDER BY id DESC");
    res.status(200).json(result.rows);
    client.release();
  } catch (error) {
    console.error("Erro ao pesquisar Profiles:", error);
    res.status(500).json({ error: "Erro ao pesquisar Profiles" });
  }
}

// GET PROFILE BY ID
async function getProfileById(req, res) {
  const profileId = req.params.id;

  try {
    const client = await pool.connect();

    const query = "SELECT * FROM Profile WHERE id = $1";
    const result = await client.query(query, [profileId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile não encontrado" });
    }

    res.status(200).json(result.rows[0]);
    client.release();
  } catch (error) {
    console.error("Erro ao buscar Profile por ID:", error);
    res.status(500).json({ error: "Erro ao buscar Profile por ID" });
  }
}

// UPDATE PROFILE
async function updateProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, name } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se já existe para outro perfil
    let query =
      "SELECT COUNT(*) as count FROM Profile WHERE name = $1 AND id != $2";
    let result = await client.query(query, [name, id]);

    if (result.rows[0].count > 0) {
      return res
        .status(400)
        .json({ error: "O Nome já está a ser utilizado por outro Profile" });
    }

    // Atualizar o perfil
    query = "UPDATE Profile SET name = $1 WHERE id = $2";
    result = await client.query(query, [name, id]);

    if (result.rowCount > 0) {
      res.status(200).send("Profile atualizado com sucesso.");
    } else {
      res.status(404).send("Profile não encontrado.");
    }

    client.release();
  } catch (error) {
    console.error("Erro ao atualizar Profile:", error);
    res.status(500).json({ error: "Erro ao atualizar Profile" });
  }
}

// DELETE PROFILE
async function deleteProfile(req, res) {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    // Verificar se o perfil existe
    let query = "SELECT COUNT(*) as count FROM Profile WHERE id = $1";
    let result = await client.query(query, [id]);

    if (result.rows[0].count === 0) {
      return res.status(404).json({ error: "Profile não encontrado" });
    }

    // Deletar o perfil
    query = "DELETE FROM Profile WHERE id = $1";
    result = await client.query(query, [id]);

    res.status(200).send("Profile deletado com sucesso.");
    client.release();
  } catch (error) {
    console.error("Erro ao deletar Profile:", error);
    res.status(500).json({ error: "Erro ao deletar Profile" });
  }
}

// DELETE ALL PROFILES
async function deleteProfiles(req, res) {
  try {
    const client = await pool.connect();
    const query = "DELETE FROM Profile";
    await client.query(query);
    res.status(200).send("Profiles deletados com sucesso.");
    client.release();
  } catch (error) {
    console.error("Erro ao deletar Profiles:", error);
    res.status(500).json({ error: "Erro ao deletar Profiles" });
  }
}

module.exports = {
  postProfiles,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  deleteProfiles,
  validateProfile,
};
