const { body, validationResult } = require("express-validator");
const pool = require("../../../db/DBConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validateLogin = [
  body("username").notEmpty().withMessage("Username é obrigatório"),
  body("password").notEmpty().withMessage("Password é obrigatória"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const client = await pool.connect();
    const query = "SELECT * FROM Utilizador WHERE username = $1";
    const result = await client.query(query, [username]);

    if (result.rows.length === 0) {
      client.release();
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      client.release();
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        profile_id: user.profile_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    client.release();
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { validateLogin, loginUser };
