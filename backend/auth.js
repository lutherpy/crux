const jwt = require("jsonwebtoken");

const authJWT = (req, res, next) => {
  try {
    // Verificar se o cabeçalho Authorization está presente
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Cabeçalho de autorização ausente" });
    }

    // Extrair o token do cabeçalho Authorization
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Token de autenticação não fornecido" });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Armazenar os dados decodificados do token no objeto req
    req.user = decoded;

    // Passar para o próximo middleware ou rota
    next();
  } catch (error) {
    // Verificar se o erro foi causado por expiração ou invalidez do token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }

    // Outros erros (ex: erro de servidor)
    console.error("Erro ao verificar token JWT:", error);
    console.log(req.user); // Verifique o conteúdo aqui para garantir que o "departamento" está presente

    return res.status(500).json({ error: "Erro ao processar o token" });
  }
};

module.exports = authJWT;
