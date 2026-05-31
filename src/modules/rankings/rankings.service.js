const pool = require("../../config/database.js");

function calcularNivel(xpTotal) {
  return Math.floor(xpTotal / 100) + 1;
}

async function rankingGlobal(limite) {
  const resultado = await pool.query(
    `SELECT
      u.id,
      u.nome,
      COALESCE(SUM(x.xp_ganho), 0)::int AS xp_total
    FROM usuarios u
    LEFT JOIN xp_log x ON x.user_id = u.id
    GROUP BY u.id, u.nome
    ORDER BY xp_total DESC, u.nome ASC
    LIMIT $1`,
    [limite],
  );

  return resultado.rows.map(function mapear(row, index) {
    return {
      posicao: index + 1,
      user_id: row.id,
      nome: row.nome,
      xp_total: row.xp_total,
      nivel: calcularNivel(row.xp_total),
    };
  });
}

async function rankingAcademia(academiaId, limite) {
  const resultado = await pool.query(
    `SELECT
      u.id,
      u.nome,
      COALESCE(SUM(x.xp_ganho), 0)::int AS xp_total
    FROM academia_membros am
    JOIN usuarios u ON u.id = am.user_id
    LEFT JOIN xp_log x ON x.user_id = u.id
    WHERE am.academia_id = $1 AND am.ativo = true
    GROUP BY u.id, u.nome
    ORDER BY xp_total DESC, u.nome ASC
    LIMIT $2`,
    [academiaId, limite],
  );

  return resultado.rows.map(function mapear(row, index) {
    return {
      posicao: index + 1,
      user_id: row.id,
      nome: row.nome,
      xp_total: row.xp_total,
      nivel: calcularNivel(row.xp_total),
    };
  });
}

async function meuProgresso(userId) {
  const xpResult = await pool.query(
    "SELECT COALESCE(SUM(xp_ganho), 0)::int AS xp_total FROM xp_log WHERE user_id = $1",
    [userId],
  );

  const xpTotal = xpResult.rows[0].xp_total;

  const posicaoResult = await pool.query(
    `SELECT COUNT(*) + 1 AS posicao
     FROM (
       SELECT u.id, COALESCE(SUM(x.xp_ganho), 0) AS total
       FROM usuarios u
       LEFT JOIN xp_log x ON x.user_id = u.id
       GROUP BY u.id
     ) r
     WHERE r.total > (
       SELECT COALESCE(SUM(xp_ganho), 0) FROM xp_log WHERE user_id = $1
     )`,
    [userId],
  );

  const historico = await pool.query(
    `SELECT xp_ganho, motivo, treino_id, criado_em
     FROM xp_log
     WHERE user_id = $1
     ORDER BY criado_em DESC
     LIMIT 10`,
    [userId],
  );

  return {
    xp_total: xpTotal,
    nivel: calcularNivel(xpTotal),
    posicao_global: parseInt(posicaoResult.rows[0].posicao, 10),
    ultimos_xp: historico.rows,
  };
}

module.exports = { rankingGlobal, rankingAcademia, meuProgresso, calcularNivel };
