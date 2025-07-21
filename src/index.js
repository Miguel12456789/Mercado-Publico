require('dotenv').config(); // Carrega variáveis de ambiente do ficheiro .env
const express = require('express'); // Framework para criação de servidor web
const app = express(); // Instância do servidor Express
const path = require('path'); // Módulo nativo para lidar com caminhos de ficheiros
const router = require('./router/router'); // Importa as rotas definidas
const connectDB = require("./config/config"); // Importa função para conectar à base de dados
const session = require('express-session'); // Middleware para sessões
const contractsController = require('./controller/contractsController'); // Controlador para contratos



// Configura o EJS como motor de visualização
app.set('view engine', 'ejs'); // Define o EJS como motor de templates
app.set('views', path.join(__dirname, '../views')); // Define o caminho da pasta de views


// Static file
app.use(express.json()); // Permite ler JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Permite ler dados de formulários
app.use(express.static("public")); // Serve ficheiros estáticos da pasta public
app.use(express.static("src")); // Serve ficheiros estáticos da pasta src


app.use(session({
  secret: 'sua_chave_secreta_segura',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // deixe `false` se estiver em ambiente de desenvolvimento HTTP
}));

// Usa o roteador
app.use('/', router);


connectDB().then(({ conn1, conn1_1, conn2, conn3, conn4, conn5 }) => {
  app.locals.conn1 = conn1;
  app.locals.conn1_1 = conn1_1;
  app.locals.conn2 = conn2;
  app.locals.conn3 = conn3;
  app.locals.conn4 = conn4;
  app.locals.conn5 = conn5;
  contractsController.initModels(app);
});

module.exports = app;