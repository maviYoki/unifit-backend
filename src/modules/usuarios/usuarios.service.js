const pool = require("../../config/database.js");

async function buscarPerfil(userId) {
  const resultado = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
    userId,
  ]);

  //Verifica se retornou vazio
  if (resultado.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  return resultado.rows[0];
}

async function atualizarPerfil(userId, nome) {
  const resultado = await pool.query(
    "UPDATE usuarios SET nome = $1 WHERE id = $2 RETURNING *",
    [nome, userId],
  );

  //Verifica se retornou vazio
  if (resultado.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  return resultado.rows[0];
}

module.exports = { buscarPerfil, atualizarPerfil };
