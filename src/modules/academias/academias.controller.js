const service = require("../services/academias.service");

//Importar CSV
async function importarCSV(req, res) {
  try {
    const academiaId = req.params.id;
    const userId = req.user.user_id;
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

//Ativar ou desativar membro
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

//Controller para listar membros
async function listarMembros(req, res) {
  try {
    //Capturar dados da requisicao
    const academiaId = req.params.id;
    const ativo = req.query.ativo; //opcional

    //Chamar service
    const resultado = await service.listarMembros(academiaId, ativo);

    //Retornar lista
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
}
module.exports = { importarCSV, alterarStatusMembro, listarMembros };
