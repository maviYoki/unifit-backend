const express = require("express");
const router = express.Router();
const controller = require("./usuarios.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");

router.get("/perfil", authMiddleware, controller.perfil);
router.put("/perfil", authMiddleware, controller.atualizar);

module.exports = router;
