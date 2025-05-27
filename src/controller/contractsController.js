const mongoose = require('mongoose');
const express = require('express');
const { base_gov } = require('../model/model'); // Ajuste o caminho conforme necessário

// Modifique o contractsController:
const contractsGet = async (req, res) => {
  try {
    console.log('Recebidos query params:', req.query); // Adicione isto para depuração

    // Parâmetros de paginação - garantir que são números válidos
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = [25, 50, 100].includes(parseInt(req.query.limit))
      ? parseInt(req.query.limit)
      : 25;
    const skip = (page - 1) * limit;


    // Consulta com paginação
    const contracts = await base_gov.find({})
      .skip(skip)
      .limit(limit)
      .lean();

    // Contar total de documentos
    const totalContracts = await base_gov.countDocuments({});

    // Cálculos de paginação
    const totalPages = Math.ceil(totalContracts / limit);
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalContracts: totalContracts,
      limit: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      startIndex: skip + 1,
      endIndex: Math.min(skip + limit, totalContracts)
    };

    console.log(`Página ${page}: ${contracts.length} contratos de ${totalContracts} total`);

    // Verifica se é uma requisição AJAX
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ contracts, pagination });
    } else {
      return res.render('base_gov', { contracts, pagination });
    }
  } catch (error) {
    console.error('Erro completo:', error);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = { contractsGet };  