const pool = require("../../config/database.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function verificarMembroAtivo(userId) {
  const statusMembro = await pool.query(
    "SELECT 1 FROM academia_membros WHERE user_id = $1 AND ativo = true",
    [userId],
  );

  if (statusMembro.rows.length === 0) {
    throw new Error("Usuário inativo, procure regularizar cadastro");
  }
}

async function enviarCodigoWhatsapp(celular, codigo) {
  if (!process.env.ZAPI_INSTANCE_ID || !process.env.ZAPI_TOKEN) {
    throw new Error("Configuração Z-API incompleta");
  }

  const resposta = await fetch(
    `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: celular,
        message: "Seu código é: " + codigo,
      }),
    },
  );

  if (!resposta.ok) {
    throw new Error("Falha ao enviar código pelo WhatsApp");
  }
}

async function solicitarCodigo(celular) {
  const celularLimpo = String(celular).trim();

  const resultado = await pool.query(
    "SELECT * FROM usuarios WHERE celular = $1",
    [celularLimpo],
  );

  if (resultado.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  const usuario = resultado.rows[0];

  await verificarMembroAtivo(usuario.id);

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  const expiraEm = new Date(new Date().getTime() + 10 * 60 * 1000);

  await pool.query(
    "INSERT INTO otp_codes (celular, codigo, expira_em) VALUES ($1,$2,$3)",
    [celularLimpo, codigo, expiraEm],
  );

  await enviarCodigoWhatsapp(celularLimpo, codigo);

  return "Codigo enviado com sucesso para o Whatsapp: " + celularLimpo;
}

async function verificarCodigo(celular, codigo) {
  const celularLimpo = String(celular).trim();
  const codigoLimpo = String(codigo).trim();

  const resultado = await pool.query(
    "SELECT * FROM otp_codes WHERE celular = $1 AND codigo = $2 AND usado = false AND expira_em > now()",
    [celularLimpo, codigoLimpo],
  );

  if (resultado.rows.length === 0) {
    throw new Error("Código inválido ou expirado");
  }

  const otp = resultado.rows[0];

  await pool.query("UPDATE otp_codes SET usado = true WHERE id = $1", [otp.id]);

  const usuarioResult = await pool.query(
    "SELECT * FROM usuarios WHERE celular = $1",
    [celularLimpo],
  );

  if (usuarioResult.rows.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  const usuario = usuarioResult.rows[0];

  await verificarMembroAtivo(usuario.id);

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado");
  }

  const token = jwt.sign(
    {
      user_id: usuario.id,
      tipo_base: usuario.tipo_base,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    },
  );

  const tokenHash = await bcrypt.hash(token, 10);
  const expiraEm = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);

  await pool.query(
    "INSERT INTO sessoes (user_id, token_hash, expira_em) VALUES ($1,$2,$3)",
    [usuario.id, tokenHash, expiraEm],
  );

  return token;
}

module.exports = { solicitarCodigo, verificarCodigo };
