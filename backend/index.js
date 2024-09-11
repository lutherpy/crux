const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const basicAuth = require("basic-auth");

const app = express();

// Executar o script db/script.js

// Rotas
const userRoutes = require("./app/routes/user/UsersRoutes");
const profileRoutes = require("./app/routes/profile/ProfileRoutes");
const loginRoutes = require("./app/routes/login/LoginRoutes");
const aplicacaoRoutes = require("./app/routes/aplicacao/AplicacaoRoutes");
const servidorRoutes = require("./app/routes/servidor/ServidorRoutes");
const departamentoRoutes = require("./app/routes/departamento/DepartamentoRoutes");
const linkRoutes = require("./app/routes/link/LinkRoutes");
const departamentosGeraisRoutes = require("./app/routes/departamentosGerais/DepartamentosGeraisRoutes");

// Permitir o acesso de diferentes servidores
app.use(cors());
app.use(express.json());

// Middleware de autenticação básica
const auth = (req, res, next) => {
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

// Aplicar o middleware de autenticação a todas as rotas
app.use(auth);

// Usar as rotas
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/aplicacao", aplicacaoRoutes);
app.use("/api/servidor", servidorRoutes);
app.use("/api/departamento", departamentoRoutes);
app.use("/api/link", linkRoutes);
app.use("/api/deps", departamentosGeraisRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
