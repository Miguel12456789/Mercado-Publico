require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const app = express();
const path = require('path');
const router = require('./router/router');
const connectDB = require("./config/config");
const session = require('express-session');
const contractsController = require('./controller/contractsController');


// Configura o EJS como motor de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views')); // Garante o caminho correto para as views

// Static file
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Para formulários tradicionais
app.use(express.static("public")); // Serve static files from the public folder
app.use(express.static("src")); // Serve static files from the src folder

app.use(session({
  secret: 'sua_chave_secreta_segura',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // deixe `false` se estiver em ambiente de desenvolvimento HTTP
}));

// Usa o roteador
app.use('/', router);


connectDB().then(({ conn1, conn2, conn3 }) => {
  app.locals.conn1 = conn1;
  app.locals.conn2 = conn2;
  app.locals.conn3 = conn3;
  contractsController.initModels(app);
});

module.exports = app;