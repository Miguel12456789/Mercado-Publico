const mongoose = require('mongoose');
const express = require('express');


const baseGovSchema = new mongoose.Schema({}, { strict: false });
const BaseGov = mongoose.model('base_gov', baseGovSchema, 'base_gov');

const contentGet = async (req, res, next) => {
  try {
    const data = await BaseGov.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ error: 'Erro ao buscar dados da base_gov' });
  }
};

module.exports = { contentGet };