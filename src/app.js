const express = require("express");
require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();

const PORT = process.env.PORT || 3000; //Porta definida no .env ou padrão 3000

app.use(express.json()); //middleware para interpretar JSON nas requisições

//Importando as rotas
const usuariosRoutes = require("./modules/usuarios/usuarios.routes.js");
const academiasRoutes = require("./modules/academias/academias.routes.js");
const authRoutes = require("./modules/auth/auth.routes.js");

//Usando as rotas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/academias", academiasRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

//HANDLER DE ERROS GLOBAL - qualquer erro não tratado
app.use((err, req, res, next) => {
  console.error("Erro:", err.message);
  res.status(500).json({ erro: "Erro interno do servidor" });
});
