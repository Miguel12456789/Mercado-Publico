const mongoose = require('mongoose');
const express = require('express');


const baseGovSchema = new mongoose.Schema({}, { strict: false });
const BaseGov = mongoose.model('base_gov', baseGovSchema, 'base_gov');

const contractsGet = async (req, res, next) => {
  try {
      const contracts = await BaseGov.find({});
      res.render('base_gov', { contracts }); // Pass contracts to the base_gov template
  } catch (error) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).send('Erro ao buscar dados da base_gov');
  }
};

module.exports = { contractsGet };