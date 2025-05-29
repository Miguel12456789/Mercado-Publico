const mongoose = require('mongoose');
const express = require('express');
const { base_gov } = require('../model/model'); // Ajuste o caminho conforme necessário

// Modifique o contractsController:
// contractsController.js
const contractsGet = async (req, res) => {
  try {
    console.log('Recebidos query params:', req.query);

    const rawPage = parseInt(req.query.page, 10);
    const rawLimit = parseInt(req.query.limit, 10);

    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = [25, 50, 100].includes(rawLimit) ? rawLimit : 25;
    const skip = (page - 1) * limit;

    const [contracts, totalContracts] = await Promise.all([
      base_gov.find({}).skip(skip).limit(limit).lean(),
      base_gov.countDocuments({})
    ]);

    // Adicione um ID único para cada contrato
    contracts.forEach((contract, index) => {
      contract.uniqueId = skip + index + 1;
    });

    const totalPages = Math.ceil(totalContracts / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      totalContracts,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      startIndex: skip + 1,
      endIndex: Math.min(skip + limit, totalContracts)
    };

    console.log(`Página ${page}: ${contracts.length} contratos de ${totalContracts} total`);

    const isAjax = req.xhr || req.headers.accept?.includes('json');

    if (isAjax) {
      return res.json({ contracts, pagination });
    }

    return res.render('base_gov', { 
      contracts, 
      pagination,
      // Adicione esta linha para incluir a função de detalhes
      includeDetails: true
    });

  } catch (error) {
    console.error('Erro completo:', error);
    return res.status(500).send('Erro no servidor');
  }
};

const contractDetails = async (req, res) => {
  try {
    const contract = await base_gov.findById(req.params.id).lean();
    if (!contract) {
      return res.status(404).send('Contrato não encontrado');
    }
    res.render('components/detalhes', { contract });
  } catch (error) {
    console.error('Erro ao buscar detalhes do contrato:', error);
    res.status(500).send('Erro no servidor');
  }
};


module.exports = { contractsGet, contractDetails };