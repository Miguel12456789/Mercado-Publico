const express = require('express');
const router = express.Router();
const navegationController = require('./navegationController');
const emailController = require('../controller/emailController');
const contractsController = require('../controller/contractsController');
const e = require('express');

router.get("/", navegationController.home);

router.get("/base_gov", contractsController.contractsGet);

router.get("/detalhescontrato/:id", contractsController.contractDetail);

router.post('/components/mail_receiver', emailController.sendEmail, emailController.verify_code);

router.get("/estatisticas_setor_publico", navegationController.estatisticas_setor_publico);
router.get("/estatisticas_setor_privado", navegationController.estatisticas_setor_privado);
router.get("/oportunidade_contratacao_publica", navegationController.oportunidade_contratacao_publica);
router.get("/outros", navegationController.outros);

module.exports = router;