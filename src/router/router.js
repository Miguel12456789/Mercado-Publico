const express = require('express');
const router = express.Router();
const emailController = require('../controller/emailController');
const navegationController = require('./navegationController');
const contractsController = require('../controller/contractsController');

router.get("/", navegationController.home);

router.post('/api/send-email', emailController.sendEmail);

router.get("/base_gov", contractsController.contractsGet);

router.get("/estatisticas_setor_publico", navegationController.estatisticas_setor_publico);
router.get("/estatisticas_setor_privado", navegationController.estatisticas_setor_privado);
router.get("/oportunidade_contratacao_publica", navegationController.oportunidade_contratacao_publica);
router.get("/outros", navegationController.outros);

module.exports = router;