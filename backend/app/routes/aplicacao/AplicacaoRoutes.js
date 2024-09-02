const express = require("express");
const aplicacaoController = require("../../controllers/aplicacao/AplicacaoController");
const {
  validateAplicacao,
  postAplicacoes,
  deleteAplicacao,
  deleteAplicacoes,
  getAplicacoes,
  getAplicacaoById,
  updateAplicacao,
} = aplicacaoController;

const router = express.Router();

router.post("/", validateAplicacao, postAplicacoes);
router.get("/", getAplicacoes);
router.get("/:id", getAplicacaoById);
router.put("/:id", updateAplicacao);
router.delete("/:id", deleteAplicacao);
router.delete("/", deleteAplicacoes);

module.exports = router;
