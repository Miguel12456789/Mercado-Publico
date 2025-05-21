const mongoose = require('mongoose');
const express = require('express');


const baseGovSchema = new mongoose.Schema({}, { strict: false });
const BaseGov = mongoose.model('base_gov', baseGovSchema, 'base_gov');

const contractsGet = async (req, res, next) => {
  try {
    console.log('Iniciando busca de contratos na coleção:', BaseGov.collection.name); // Indica o início da busca
    const contracts = await BaseGov.find({});
    console.log('Busca de contratos concluída. Resultados:', contracts); // Indica que a busca foi concluída
    res.render('components/tab_base', { contracts });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).send('Erro ao buscar dados da base_gov');
  }
};



module.exports = { contractsGet };