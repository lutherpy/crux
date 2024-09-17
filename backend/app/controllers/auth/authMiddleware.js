const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");
const app = express();

// Rotas
const userRoutes = require("./app/routes/user/UsersRoutes");
const profileRoutes = require("./app/routes/profile/ProfileRoutes");
const loginRoutes = require("./app/routes/login/LoginRoutes");
const aplicacaoRoutes = require("./app/routes/aplicacao/AplicacaoRoutes");
const servidorRoutes = require("./app/routes/servidor/ServidorRoutes");
const departamentoRoutes = require("./app/routes/departamento/DepartamentoRoutes");
const linkRoutes = require("./app/routes/link/LinkRoutes");
const departamentosGeraisRoutes = require("./app/routes/departamentosGerais/DepartamentosGeraisRoutes");

// Middleware de autenticação básica
const authBasic = (req, res, next) => {
  const user = basicAuth(req);
  if (
    user &&
    user.name === process.env.BASIC_AUTH_USER &&
    user.pass === process.env.BASIC_AUTH_PASS
  ) {
    return next();
  } else {
    res.set("WWW-Authenticate", 'Basic realm="401"');
    res.status(401).send("Authentication required.");
  }
};

// Middleware de autorização JWT
const authJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrair o token do cabeçalho Authorization

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token de autenticação não fornecido" });
  }

  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Armazenar os dados decodificados do token no objeto req
    next(); // Passa para o próximo middleware ou rota
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

// Aplicar os middlewares
app.use(cors());
app.use(express.json());
app.use(authBasic); // Aplica autenticação básica a todas as rotas

// Usar as rotas com middleware de JWT
app.use("/api/users", authJWT, userRoutes);
app.use("/api/profiles", authJWT, profileRoutes);
app.use("/api/login", loginRoutes); // Login não precisa de autenticação JWT
app.use("/api/aplicacao", authJWT, aplicacaoRoutes);
app.use("/api/servidor", authJWT, servidorRoutes);
app.use("/api/departamento", authJWT, departamentoRoutes);
app.use("/api/link", authJWT, linkRoutes);
app.use("/api/deps", authJWT, departamentosGeraisRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
