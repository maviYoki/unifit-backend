const pool = require("../config/database.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function authMiddleware(req, res, next) {
  try {
    //Ler header Authorization
    const tokenHeader = req.headers.authorization;

    //Verificar se token foi enviado
    if (!tokenHeader) {
      return res.status(401).json({ erro: "Token não fornecido" });
    }

    //Separar Bearer do token
    const partesToken = tokenHeader.split(" ");

    //Validar formato Bearer
    if (partesToken.length !== 2 || partesToken[0] !== "Bearer") {
      return res.status(401).json({ erro: "Token mal formatado" });
    }

    const token = partesToken[1];

    //Validar JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    //Buscar sessoes ativas do usuario
    const resultado = await pool.query(
      "SELECT * FROM sessoes WHERE user_id = $1 AND expira_em > now()",
      [payload.user_id],
    );

    //Comparar token com hash da sessao
    let sessaoValida = false;
    for (let i = 0; i < resultado.rows.length; i++) {
      const sessao = resultado.rows[i];
      const match = await bcrypt.compare(token, sessao.token_hash);
      if (match) {
        sessaoValida = true;
        break;
      }
    }

    //Verificar se encontrou sessao valida
    if (!sessaoValida) {
      return res.status(401).json({ erro: "Sessão inválida ou expirada" });
    }

    //Anexar usuario na requisicao
    req.usuario = {
      user_id: payload.user_id,
      tipo_base: payload.tipo_base,
    };

    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}

module.exports = authMiddleware;
