const { Router } = require("express");
const router = Router();

const authController = require("./auth.controller.js");

router.post("/solicitar-codigo", authController.solicitarCodigo);
router.post("/validar-codigo", authController.verificarCodigo);

module.exports = router;
