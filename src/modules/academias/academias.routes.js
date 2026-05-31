const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("./academias.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");

const upload = multer({ dest: "uploads/" });

router.post(
  "/:id/importar-csv",
  authMiddleware,
  upload.single("file"),
  controller.importarCSV,
);

router.patch(
  "/:id/membros/:userId",
  authMiddleware,
  controller.alterarStatusMembro,
);

router.get("/:id/membros", authMiddleware, controller.listarMembros);

module.exports = router;
