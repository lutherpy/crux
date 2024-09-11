const express = require("express");
const departamentosGeraisController = require("../../controllers/departamentosGerais/DepartamentosGeraisController");
const { getDepartamentosGerais, getDepartamentoGeralById } =
  departamentosGeraisController;

const router = express.Router();

router.get("/", getDepartamentosGerais);
router.get("/:id", getDepartamentoGeralById);

module.exports = router;
