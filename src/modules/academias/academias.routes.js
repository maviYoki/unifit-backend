const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/academias.controller");
const verificarToken = require("../middlewares/verificarToken");

const upload = multer({ dest: "uploads/" });

//Importar CSV
router.post(
  "/academias/:id/importar-csv",
  upload.single("file"),
  controller.importarCSV,
);

//Ativar ou desativar aluno
router.patch(
  "/academias/:id/membros/:userId",
  verificarToken,
  controller.alterarStatusMembro,
);

//Rota para listar membros da academia
router.get("/academias/:id/membros", verificarToken, controller.listarMembros);

module.exports = router;
