const express = require("express");
const departamentoController = require("../../controllers/departamento/DepartamentoController");
const {
  validateDepartamento,
  postDepartamento,
  deleteDepartamento,
  deleteDepartamentos,
  getDepartamentos,
  getDepartamentoById,
  updateDepartamento,
} = departamentoController;

const router = express.Router();

router.post("/", validateDepartamento, postDepartamento);
router.get("/", getDepartamentos);
router.get("/:id", getDepartamentoById);
router.put("/:id", updateDepartamento);
router.delete("/:id", deleteDepartamentos);
router.delete("/", deleteDepartamento);

module.exports = router;
