const express = require("express");
const router = express.Router();
const controller = require("./rankings.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");

router.get("/meu-progresso", authMiddleware, controller.meuProgresso);
router.get("/global", authMiddleware, controller.global);
router.get("/academia/:academiaId", authMiddleware, controller.academia);

module.exports = router;
