const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  //Receber token do header Authorization
  const tokenHeader = req.headers["authorization"];

  try {
    //Verificar se token foi enviado
    if (!tokenHeader) {
      return res.status(401).json({ erro: "Token nao fornecido" });
    }

    //Separar tipo Bearer do token
    const partesToken = tokenHeader.split(" ");

    //Validar formato do token
    if (partesToken.length !== 2 || partesToken[0] !== "Bearer") {
      return res.status(401).json({ erro: "Token mal formatado" });
    }

    //Salvar token puro
    const token = partesToken[1];

    //Validar token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    //Salvar dados do usuario na requisicao
    req.user = {
      user_id: payload.user_id,
      tipo_base: payload.tipo_base,
    };

    //Continuar fluxo
    next();
  } catch (erro) {
    //Token invalido ou expirado
    return res.status(401).json({ erro: "Token invalido ou expirado" });
  }
};

module.exports = verificarToken;
