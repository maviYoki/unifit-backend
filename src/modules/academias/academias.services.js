const fs = require("fs"); //Manipular arquivos
const csv = require("csv-parser"); //Ler arquivo CSV
const pool = require("../../config/database.js");

//Importar membros via CSV
async function importarMembrosCSV(academiaId, userId, filePath) {
  //Verificar permissao de instrutor
  const permissao = await pool.query(
    "SELECT 1 FROM academia_membros WHERE user_id = $1 AND academia_id = $2 AND papel = 'instrutor' AND ativo = true",
    [userId, academiaId],
  );

  //Validar permissao
  if (permissao.rows.length === 0) {
    throw new Error("Sem permissão");
  }

  let inseridos = 0;
  let atualizados = 0;
  let erros = [];

  //Ler CSV e transformar em array
  const linhas = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (linha) => linhas.push(linha))
      .on("end", resolve)
      .on("error", reject);
  });

  //Processar linhas
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];

    try {
      const nome = linha.nome;
      const celular = linha.celular;
      const papel = linha.papel;

      if (!nome || !celular || !papel) {
        throw new Error("Dados incompletos");
      }

      const u = await pool.query("SELECT * FROM usuarios WHERE celular = $1", [
        celular,
      ]);

      let usuario;

      if (u.rows.length === 0) {
        const novo = await pool.query(
          "INSERT INTO usuarios (nome, celular, tipo_base) VALUES ($1,$2,'comum') RETURNING *",
          [nome, celular],
        );

        usuario = novo.rows[0];
      } else {
        usuario = u.rows[0];
      }

      const v = await pool.query(
        "SELECT * FROM academia_membros WHERE user_id = $1 AND academia_id = $2",
        [usuario.id, academiaId],
      );

      if (v.rows.length === 0) {
        await pool.query(
          "INSERT INTO academia_membros (user_id, academia_id, papel, ativo) VALUES ($1,$2,$3,true)",
          [usuario.id, academiaId, papel],
        );

        inseridos++;
      } else {
        atualizados++;
      }
    } catch (err) {
      erros.push({
        linha: i + 1,
        erro: err.message,
      });
    }
  }

  fs.unlinkSync(filePath);

  return { inseridos, atualizados, erros };
}

//Ativar ou desativar membro
async function alterarStatusMembro(academiaId, userId, ativo) {
  const resultado = await pool.query(
    "UPDATE academia_membros SET ativo = $1 WHERE academia_id = $2 AND user_id = $3 RETURNING *",
    [ativo, academiaId, userId],
  );

  if (resultado.rows.length === 0) {
    throw new Error("Membro nao encontrado na academia");
  }

  return resultado.rows[0];
}

//Listar membros
async function listarMembros(academiaId, ativo) {
  let query = `
    SELECT 
      u.id,
      u.nome,
      u.celular,
      am.ativo,
      am.papel
    FROM academia_membros am
    JOIN usuarios u ON u.id = am.user_id
    WHERE am.academia_id = $1
  `;

  const params = [academiaId];

  if (ativo !== undefined) {
    query += " AND am.ativo = $2";
    params.push(ativo === "true");
  }

  query += " ORDER BY u.nome ASC";

  const resultado = await pool.query(query, params);

  return resultado.rows;
}

module.exports = {
  importarMembrosCSV,
  alterarStatusMembro,
  listarMembros,
};
