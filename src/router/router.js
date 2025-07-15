const express = require('express');
const router = express.Router();
const navegationController = require('./navegationController');
const emailController = require('../controller/emailController');
const contractsController = require('../controller/contractsController');
const e = require('express');

router.get("/", navegationController.home);

router.get("/mp", contractsController.contractsGet);

router.get("/detalhescontrato/:id", contractsController.contractDetail);

router.get('/download_contracts', contractsController.downloadContracts);

router.post('/components/mail_receive', emailController.sendEmail);
router.post('/components/verify_code', emailController.verify_code);


router.get("/sPub", navegationController.sPub);
router.get("/estat_spri", navegationController.estat_spri);
router.get("/op_cp", navegationController.op_cp);
router.get("/outros", navegationController.outros);

module.exports = router;