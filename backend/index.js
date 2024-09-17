const express = require("express");
const cors = require("cors");
const authJWT = require("./auth"); // Importar o middleware JWT
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

// Aplicar middlewares
app.use(cors());
app.use(express.json());

// Aplicar JWT a todas as rotas, exceto login
app.use("/api/login", loginRoutes); // Login não precisa de autenticação JWT

// Aplicar JWT a todas as outras rotas
app.use(authJWT);

app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/aplicacao", aplicacaoRoutes);
app.use("/api/servidor", servidorRoutes);
app.use("/api/departamento", departamentoRoutes);
app.use("/api/link", linkRoutes);
app.use("/api/deps", departamentosGeraisRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
