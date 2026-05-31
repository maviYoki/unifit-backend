const service = require("./rankings.service.js");

async function global(req, res) {
  try {
    const limite = parseInt(req.query.limite, 10) || 20;
    const resultado = await service.rankingGlobal(limite);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function academia(req, res) {
  try {
    const limite = parseInt(req.query.limite, 10) || 20;
    const resultado = await service.rankingAcademia(
      req.params.academiaId,
      limite,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function meuProgresso(req, res) {
  try {
    const resultado = await service.meuProgresso(req.usuario.user_id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = { global, academia, meuProgresso };
