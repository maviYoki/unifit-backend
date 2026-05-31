const pool = require("../../config/database.js");

async function listar(grupoMuscular) {
  let query = "SELECT * FROM exercicios_banco";
  const params = [];

  if (grupoMuscular) {
    query += " WHERE grupo_muscular = $1";
    params.push(grupoMuscular);
  }

  query += " ORDER BY grupo_muscular ASC, nome ASC";

  const resultado = await pool.query(query, params);
  return resultado.rows;
}

async function buscar(id) {
  const resultado = await pool.query(
    "SELECT * FROM exercicios_banco WHERE id = $1",
    [id],
  );

  if (resultado.rows.length === 0) {
    throw new Error("Exercício não encontrado no banco");
  }

  return resultado.rows[0];
}

async function criar(nome, grupoMuscular, descricao) {
  const resultado = await pool.query(
    "INSERT INTO exercicios_banco (nome, grupo_muscular, descricao) VALUES ($1, $2, $3) RETURNING *",
    [nome, grupoMuscular || null, descricao || null],
  );

  return resultado.rows[0];
}

module.exports = { listar, buscar, criar };
