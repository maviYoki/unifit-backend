const express = require("express");
const router = express.Router();
const controller = require("./exercicios-banco.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");

router.get("/", authMiddleware, controller.listar);
router.get("/:id", authMiddleware, controller.buscar);
router.post("/", authMiddleware, controller.criar);

module.exports = router;
