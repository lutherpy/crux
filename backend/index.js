const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const basicAuth = require("basic-auth");

const app = express();

// Executar o script db/script.js

// Rotas
const userRoutes = require("./app/routes/user/UsersRoutes");
const profileRoutes = require("./app/routes/profile/ProfileRoutes");

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
