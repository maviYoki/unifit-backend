const service = require("./exercicios-banco.service.js");

async function listar(req, res) {
  try {
    const { grupo_muscular } = req.query;
    const resultado = await service.listar(grupo_muscular);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function buscar(req, res) {
  try {
    const resultado = await service.buscar(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function criar(req, res) {
  try {
    const { nome, grupo_muscular, descricao } = req.body;
    if (!nome) return res.status(400).json({ erro: "Campo nome obrigatório" });
    const resultado = await service.criar(nome, grupo_muscular, descricao);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = { listar, buscar, criar };
