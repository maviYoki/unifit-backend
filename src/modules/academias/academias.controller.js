const service = require("./academias.services.js");

async function importarCSV(req, res) {
  try {
    const academiaId = req.params.id;
    const userId = req.usuario.user_id;
    const filePath = req.file.path;

    const resultado = await service.importarMembrosCSV(
      academiaId,
      userId,
      filePath,
    );

    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

async function alterarStatusMembro(req, res) {
  try {
    const academiaId = req.params.id;
    const userId = req.params.userId;
    const ativo = req.body.ativo;

    const resultado = await service.alterarStatusMembro(
      academiaId,
      userId,
      ativo,
    );

    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

async function listarMembros(req, res) {
  try {
    const academiaId = req.params.id;
    const ativo = req.query.ativo;

    const resultado = await service.listarMembros(academiaId, ativo);

    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}

module.exports = { importarCSV, alterarStatusMembro, listarMembros };
