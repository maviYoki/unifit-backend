const express = require("express");
const router = express.Router();
const controller = require("./treinos.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");

router.post("/", authMiddleware, controller.criar);
router.get("/", authMiddleware, controller.listar);

router.get("/:id/exercicios", authMiddleware, controller.listarExercicios);
router.post("/:id/exercicios", authMiddleware, controller.adicionarExercicio);
router.put(
  "/:id/exercicios/:exercicioId",
  authMiddleware,
  controller.atualizarExercicio,
);
router.delete(
  "/:id/exercicios/:exercicioId",
  authMiddleware,
  controller.removerExercicio,
);

router.get("/:id", authMiddleware, controller.buscar);
router.put("/:id", authMiddleware, controller.atualizar);
router.delete("/:id", authMiddleware, controller.deletar);
router.post("/:id/iniciar", authMiddleware, controller.iniciar);
router.post("/:id/concluir", authMiddleware, controller.concluir);

module.exports = router;
