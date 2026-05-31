const service = require("./usuarios.service.js");

async function perfil(req, res) {
  try {
    const resultado = await service.buscarPerfil(req.usuario.user_id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: "Campo nome obrigatório" });
    const resultado = await service.atualizarPerfil(
      req.usuario.user_id,
      nome,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = { perfil, atualizar };
