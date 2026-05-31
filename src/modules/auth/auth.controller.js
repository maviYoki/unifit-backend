const authService = require("./auth.service.js");

async function solicitarCodigo(req, res) {
  try {
    const { celular } = req.body;
    // Verifica se o campo 'celular' foi fornecido
    if (!celular) {
      res.status(400).json({
        erro: "Campo 'celular' é obrigatório",
      });
      return;
    }
    //Chama o service para enviar o codigo para o whatsapp
    await authService.solicitarCodigo(celular);
    res.status(200).json({
      mensagem: "Código enviado com sucesso para o Whatsapp:" + celular,
    });
  } catch (error) {
    res.status(400).json({
      erro: error.message,
    });
  }
}

async function verificarCodigo(req, res) {
  try {
    const { celular, codigo } = req.body;
    if (!celular) {
      res.status(400).json({ erro: "Campo celular obrigatório" });
      return;
    }
    if (!codigo) {
      res.status(400).json({ erro: "Campo codigo vazio" });
      return;
    }
    const token = await authService.verificarCodigo(celular, codigo);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({
      erro: error.message,
    });
  }
}
module.exports = { solicitarCodigo, verificarCodigo };
