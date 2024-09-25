const pool = require("../../../db/DBConnection");

// ### REQUISIÇÕES ###
async function getDepartamentosGerais(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, name FROM departamentos_gerais order by name asc"
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao pesquisar Departamentos:", error);
    res.status(500).json({ error: "Erro ao pesquisar Departamentos" });
  }
}

// GET Departamento BY ID
async function getDepartamentoGeralById(req, res) {
  const departamentoId = req.params.id;

  try {
    const client = await pool.connect();
    const query = "SELECT  id, name FROM departamentos_gerais WHERE id = $1 ";
    const result = await client.query(query, [departamentoId]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Departamento não encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar Departamento por ID:", error);
    res.status(500).json({ error: "Erro ao buscar Departamento por ID" });
  }
}

module.exports = {
  getDepartamentosGerais,
  getDepartamentoGeralById,
};
