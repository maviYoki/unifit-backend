const pool = require("../../config/database.js");

function calcularNivel(xpTotal) {
  return Math.floor(xpTotal / 100) + 1;
}

async function buscarTreino(id) {
  const resultado = await pool.query("SELECT * FROM treinos WHERE id = $1", [
    id,
  ]);

  if (resultado.rows.length === 0) {
    throw new Error("Treino não encontrado");
  }

  return resultado.rows[0];
}

async function verificarDono(treinoId, userId) {
  const treino = await buscarTreino(treinoId);

  if (treino.user_id !== userId) {
    throw new Error("Sem permissão neste treino");
  }

  return treino;
}

async function listarExerciciosDoTreino(treinoId) {
  const resultado = await pool.query(
    `SELECT
      e.id,
      e.treino_id,
      e.exercicio_banco_id,
      e.nome,
      e.series,
      e.repeticoes,
      e.carga_kg,
      e.observacao,
      e.ordem,
      eb.grupo_muscular
    FROM exercicios e
    LEFT JOIN exercicios_banco eb ON eb.id = e.exercicio_banco_id
    WHERE e.treino_id = $1
    ORDER BY e.ordem ASC NULLS LAST, e.nome ASC`,
    [treinoId],
  );

  return resultado.rows;
}

async function criarTreino(userId, academiaId, nome, descricao) {
  const resultado = await pool.query(
    "INSERT INTO treinos (user_id, academia_id, nome, descricao) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, academiaId || null, nome, descricao || null],
  );
  return resultado.rows[0];
}

async function listarTreinos(userId) {
  const resultado = await pool.query(
    `SELECT
      t.*,
      (SELECT COUNT(*)::int FROM exercicios e WHERE e.treino_id = t.id) AS total_exercicios
    FROM treinos t
    WHERE t.user_id = $1
    ORDER BY t.criado_em DESC`,
    [userId],
  );
  return resultado.rows;
}

async function buscarTreinoCompleto(id, userId) {
  await verificarDono(id, userId);
  const treino = await buscarTreino(id);
  const exercicios = await listarExerciciosDoTreino(id);

  return { ...treino, exercicios };
}

async function atualizarTreino(id, userId, nome, descricao) {
  await verificarDono(id, userId);

  const resultado = await pool.query(
    "UPDATE treinos SET nome = $1, descricao = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
    [nome, descricao || null, id, userId],
  );

  return resultado.rows[0];
}

async function deletarTreino(id, userId) {
  await verificarDono(id, userId);

  await pool.query("DELETE FROM treinos WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ]);

  return { mensagem: "Treino deletado com sucesso" };
}

async function adicionarExercicio(
  treinoId,
  userId,
  exercicioBancoId,
  nome,
  series,
  repeticoes,
  cargaKg,
  observacao,
) {
  await verificarDono(treinoId, userId);

  let nomeFinal = nome;
  let bancoId = exercicioBancoId || null;

  if (bancoId) {
    const banco = await pool.query(
      "SELECT * FROM exercicios_banco WHERE id = $1",
      [bancoId],
    );

    if (banco.rows.length === 0) {
      throw new Error("Exercício não encontrado no banco");
    }

    nomeFinal = banco.rows[0].nome;
  }

  if (!nomeFinal) {
    throw new Error("Informe exercicio_banco_id ou nome");
  }

  const ordemResult = await pool.query(
    "SELECT COALESCE(MAX(ordem), 0) + 1 AS prox FROM exercicios WHERE treino_id = $1",
    [treinoId],
  );

  const ordem = ordemResult.rows[0].prox;

  const resultado = await pool.query(
    `INSERT INTO exercicios
      (treino_id, exercicio_banco_id, nome, series, repeticoes, carga_kg, observacao, ordem)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      treinoId,
      bancoId,
      nomeFinal,
      series || null,
      repeticoes || null,
      cargaKg || null,
      observacao || null,
      ordem,
    ],
  );

  return resultado.rows[0];
}

async function atualizarExercicio(
  treinoId,
  exercicioId,
  userId,
  series,
  repeticoes,
  cargaKg,
  observacao,
) {
  await verificarDono(treinoId, userId);

  const resultado = await pool.query(
    `UPDATE exercicios
     SET series = $1, repeticoes = $2, carga_kg = $3, observacao = $4
     WHERE id = $5 AND treino_id = $6
     RETURNING *`,
    [
      series || null,
      repeticoes || null,
      cargaKg || null,
      observacao || null,
      exercicioId,
      treinoId,
    ],
  );

  if (resultado.rows.length === 0) {
    throw new Error("Exercício não encontrado neste treino");
  }

  return resultado.rows[0];
}

async function removerExercicio(treinoId, exercicioId, userId) {
  await verificarDono(treinoId, userId);

  const resultado = await pool.query(
    "DELETE FROM exercicios WHERE id = $1 AND treino_id = $2 RETURNING id",
    [exercicioId, treinoId],
  );

  if (resultado.rows.length === 0) {
    throw new Error("Exercício não encontrado neste treino");
  }

  return { mensagem: "Exercício removido do treino" };
}

async function listarExerciciosTreino(treinoId, userId) {
  await verificarDono(treinoId, userId);
  return listarExerciciosDoTreino(treinoId);
}

async function iniciarTreino(id, userId) {
  const treinoAtivo = await pool.query(
    "SELECT id FROM treinos WHERE user_id = $1 AND ativo = true",
    [userId],
  );

  if (treinoAtivo.rows.length > 0) {
    throw new Error("Você já tem um treino em andamento");
  }

  const resultado = await pool.query(
    "UPDATE treinos SET ativo = true WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId],
  );

  if (resultado.rows.length === 0) {
    throw new Error("Treino não encontrado");
  }

  const exercicios = await listarExerciciosDoTreino(id);

  return { ...resultado.rows[0], exercicios };
}

async function concluirTreino(id, userId) {
  const xpGanho = 100;

  const resultado = await pool.query(
    "UPDATE treinos SET ativo = false WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId],
  );

  if (resultado.rows.length === 0) {
    throw new Error("Treino não encontrado");
  }

  await pool.query(
    "INSERT INTO xp_log (user_id, treino_id, xp_ganho, motivo) VALUES ($1, $2, $3, 'Treino concluído')",
    [userId, id, xpGanho],
  );

  const xpResult = await pool.query(
    "SELECT COALESCE(SUM(xp_ganho), 0)::int AS xp_total FROM xp_log WHERE user_id = $1",
    [userId],
  );

  const xpTotal = xpResult.rows[0].xp_total;

  return {
    mensagem: "Treino concluído!",
    xp_ganho: xpGanho,
    xp_total: xpTotal,
    nivel: calcularNivel(xpTotal),
  };
}

module.exports = {
  criarTreino,
  listarTreinos,
  buscarTreinoCompleto,
  listarExerciciosTreino,
  listarExerciciosDoTreino,
  atualizarTreino,
  deletarTreino,
  adicionarExercicio,
  atualizarExercicio,
  removerExercicio,
  iniciarTreino,
  concluirTreino,
};
