require("./env.js");

if (!process.env.DATABASE_URL) {
  console.error("Verificar variável de ambiente: DATABASE_URL");
  console.error("Certifique-se de estar definida no arquivo .env na raiz do projeto");
  process.exit(1);
}

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testarConexao() {
  try {
    await pool.query("SELECT 1");
    console.log("Conectado com o banco de dados com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao conectar no banco:", error.message);
    console.error("");
    console.error("Dicas:");
    console.error("1. Supabase → Settings → Database → Connection string");
    console.error("2. Escolha 'Session pooler' (não 'Direct connection')");
    console.error("3. Copie a URI e cole no .env como DATABASE_URL");
    console.error("4. Troque [YOUR-PASSWORD] pela senha real, SEM colchetes");
    process.exit(1);
  }
}

testarConexao();

module.exports = pool;
