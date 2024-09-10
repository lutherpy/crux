const { body, validationResult } = require("express-validator");
const pool = require("../../../db/DBConnection");

// Middleware de validação
const validateServidor = [
  body("name").notEmpty().withMessage("name é obrigatório"),
  body("ip_address").notEmpty().withMessage("IP é obrigatório"),
  body("SO").notEmpty().withMessage("Sistema Operativo é obrigatório"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// GET Aplicacoes
async function getServidores(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id AS servidor_id, name AS servidor_name, ip_address AS servidor_ip, sistema_operacional AS servidor_sop FROM servidor "
      // "SELECT s.id AS servidor_id, s.name AS servidor_name, s.ip_address AS servidor_ip, s.sistema_operacional AS servidor_sop, a.id AS aplicacao_id, a.name AS aplicacao_name, a.descricao AS aplicacao_descricao, d.name AS departamento_name FROM servidor s LEFT JOIN aplicacao_servidor aps ON s.id = aps.servidor_id LEFT JOIN aplicacao a ON aps.aplicacao_id = a.id LEFT JOIN departamento d ON a.departamento = d.id ORDER BY s.id, a.id DESC;"
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao pesquisar Servidores:", error);
    res.status(500).json({ error: "Erro ao pesquisar Servidores" });
  }
}
module.exports = {
  validateServidor,
  getServidores,
};
