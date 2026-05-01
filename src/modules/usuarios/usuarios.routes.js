const express = require("express");
const router = express.Router();

router.get("/", (res, req) => {
  res.send("Rota de usuários funcionando!");
});

module.exports = router;
