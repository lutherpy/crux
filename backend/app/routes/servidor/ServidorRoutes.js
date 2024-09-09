const express = require("express");
const servidorController = require("../../controllers/servidor/ServidorController");
const { validateServidor, getServidores } = servidorController;

const router = express.Router();

router.post("/", validateServidor);
router.get("/", getServidores);

module.exports = router;
