const pool = require("../../config/database.js"); //Conexao com o BD
const jwt = require("jsonwebtoken"); //Criar e verificar tokens
const bcrypt = require("bcryptjs"); //Criptografar dados

async function solicitarCodigo(celular) {
  //Consultar numero no BD
  const resultado = await pool.query(
    "SELECT * FROM usuarios WHERE celular = $1",
    [celular],
  );

  //Verificar se retornou vazio
  if (resultado.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  //Salvar usuario encontrado
  const usuario = resultado.rows[0];

  //Consultar status ativo do membro
  const statusMembro = await pool.query(
    "SELECT * FROM academia_membros WHERE user_id = $1 AND ativo = true",
    [usuario.id],
  );

  //Verificar se usuario esta inativo
  if (statusMembro.rows.length === 0) {
    throw new Error("Usuário inativo, procure regularizar cadastro");
  }

  //Gerar codigo de acesso
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  //Definir expiracao para 10 minutos
  const expiraEm = new Date(new Date().getTime() + 10 * 60 * 1000);

  //Inserir codigo gerado no BD
  await pool.query(
    "INSERT INTO otp_codes (celular, codigo, expira_em) VALUES ($1,$2,$3)",
    [celular, codigo, expiraEm],
  );

  //Enviar codigo via API
  await fetch(
    `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE}/token/${process.env.ZAPI_TOKEN}/send-text`,
    {
      //Configurar requisicao
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: celular,
        message: "Seu código é: " + codigo,
      }),
    },
  );

  //Retornar mensagem de sucesso
  return "Codigo enviado com sucesso para o Whatsapp: " + celular;
}

async function verificarCodigo(celular, codigo) {
  //Consultar codigo OTP valido
  const resultado = await pool.query(
    "SELECT * FROM otp_codes WHERE celular = $1 AND codigo = $2 AND usado = false AND expira_em > now()",
    [celular, codigo],
  );

  //Verificar se codigo e valido
  if (resultado.rows.length === 0) {
    throw new Error("Código inválido ou expirado");
  }

  //Salvar OTP encontrado
  const otp = resultado.rows[0];

  //Marcar OTP como usado
  await pool.query("UPDATE otp_codes SET usado = true WHERE id = $1", [otp.id]);

  //Consultar usuario pelo celular
  const usuarioResult = await pool.query(
    "SELECT * FROM usuarios WHERE celular = $1",
    [celular],
  );

  //Verificar se usuario existe
  if (usuarioResult.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  //Salvar usuario encontrado
  const usuario = usuarioResult.rows[0];

  //Gerar token JWT
  const token = jwt.sign(
    {
      user_id: usuario.id,
      tipo_base: usuario.tipo_base,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );

  //Gerar hash do token
  const tokenHash = await bcrypt.hash(token, 10);

  //Definir expiracao da sessao
  const expiraEm = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);

  //Inserir sessao no BD
  await pool.query(
    "INSERT INTO sessoes (user_id, token_hash, expira_em) VALUES ($1,$2,$3)",
    [usuario.id, tokenHash, expiraEm],
  );

  //Retornar token
  return token;
}

module.exports = { solicitarCodigo, verificarCodigo };
