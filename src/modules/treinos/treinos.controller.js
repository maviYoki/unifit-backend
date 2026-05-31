const service = require("./treinos.service.js");

async function criar(req, res) {
  try {
    const { academia_id, nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ erro: "Campo nome obrigatório" });
    const resultado = await service.criarTreino(
      req.usuario.user_id,
      academia_id,
      nome,
      descricao,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function listar(req, res) {
  try {
    const resultado = await service.listarTreinos(req.usuario.user_id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function buscar(req, res) {
  try {
    const resultado = await service.buscarTreinoCompleto(
      req.params.id,
      req.usuario.user_id,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ erro: "Campo nome obrigatório" });
    const resultado = await service.atualizarTreino(
      req.params.id,
      req.usuario.user_id,
      nome,
      descricao,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function deletar(req, res) {
  try {
    const resultado = await service.deletarTreino(
      req.params.id,
      req.usuario.user_id,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function listarExercicios(req, res) {
  try {
    const resultado = await service.listarExerciciosTreino(
      req.params.id,
      req.usuario.user_id,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function adicionarExercicio(req, res) {
  try {
    const {
      exercicio_banco_id,
      nome,
      series,
      repeticoes,
      carga_kg,
      observacao,
    } = req.body;

    const resultado = await service.adicionarExercicio(
      req.params.id,
      req.usuario.user_id,
      exercicio_banco_id,
      nome,
      series,
      repeticoes,
      carga_kg,
      observacao,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function atualizarExercicio(req, res) {
  try {
    const { series, repeticoes, carga_kg, observacao } = req.body;
    const resultado = await service.atualizarExercicio(
      req.params.id,
      req.params.exercicioId,
      req.usuario.user_id,
      series,
      repeticoes,
      carga_kg,
      observacao,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function removerExercicio(req, res) {
  try {
    const resultado = await service.removerExercicio(
      req.params.id,
      req.params.exercicioId,
      req.usuario.user_id,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function iniciar(req, res) {
  try {
    const resultado = await service.iniciarTreino(
      req.params.id,
      req.usuario.user_id,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function concluir(req, res) {
  try {
    const resultado = await service.concluirTreino(
      req.params.id,
      req.usuario.user_id,
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = {
  criar,
  listar,
  buscar,
  atualizar,
  deletar,
  listarExercicios,
  adicionarExercicio,
  atualizarExercicio,
  removerExercicio,
  iniciar,
  concluir,
};
