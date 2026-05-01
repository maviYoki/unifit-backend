require("dotenv").config();

//Validação das variáveis de ambiente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error(
    "Verificar variáveis de ambiente: SUPABASE_URL e SUPABASE_SERVICE_KEY",
  );
  console.error("Certifique-se de estarem definidas no arquivo .env");
  console.error("Exemplo:");
  console.error("SUPABASE_URL=https://seu-projeto.supabase.co");
  console.error("SUPABASE_SERVICE_KEY=sb_secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  process.exit(1);
}

const { createClient } = require("@supabase/supabase-js");

//Criando o cliente do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);
// Confirmação de conexão
console.log("Conectado com o Supabase com sucesso!");
