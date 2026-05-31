const express = require("express");
require("./config/env.js");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

const authRoutes = require("./modules/auth/auth.routes.js");
const usuariosRoutes = require("./modules/usuarios/usuarios.routes.js");
const treinosRoutes = require("./modules/treinos/treinos.routes.js");
const academiasRoutes = require("./modules/academias/academias.routes.js");
const exerciciosBancoRoutes = require("./modules/exercicios-banco/exercicios-banco.routes.js");
const rankingsRoutes = require("./modules/rankings/rankings.routes.js");

const pool = require("./config/database.js");

app.get("/health", async function health(req, res) {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ ok: true, banco: true, mensagem: "API e banco OK" });
  } catch (error) {
    res.status(503).json({
      ok: false,
      banco: false,
      erro: error.message,
    });
  }
});

app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/treinos", treinosRoutes);
app.use("/academias", academiasRoutes);
app.use("/exercicios-banco", exerciciosBancoRoutes);
app.use("/rankings", rankingsRoutes);

app.use(function erroGlobal(err, req, res, next) {
  console.error("Erro:", err.message);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

app.listen(PORT, function listen() {
  console.log("Servidor rodando na porta " + PORT);
});
