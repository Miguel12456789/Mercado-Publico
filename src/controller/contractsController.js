const mongoose = require('mongoose');
const express = require('express');
const { API_2020 } = require('../model/model'); // Ajuste o caminho conforme necessário

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
      API_2020.find({}).skip(skip).limit(limit).lean(),
      API_2020.countDocuments({})
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

const contractDetailsPartial = async (req, res) => {
  try {
    const id = req.params.id;
    const contract = await API_2020.findById(id).lean();

    if (!contract) return res.status(404).send("Contrato não encontrado");

    // Renderiza sem o layout principal
    return res.render("components/detalhes", { contract, layout: false });
  } catch (error) {
    console.error("Erro ao buscar detalhes do contrato:", error);
    return res.status(500).send("Erro no servidor");
  }
};

const contractDetail = async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).render('error', {
        message: "ID do contrato inválido"
      });
    }

    const contract = await API_2020.findById(id).lean();

    if (!contract) {
      return res.status(404).render('error', {
        message: "Contrato não encontrado"
      });
    }
    return res.render("detalhescontrato", { 
      title: `Detalhes do Contrato ${contract.idcontrato}`,
      contract 
    });

  } catch (error) {
    console.error("Erro ao buscar detalhes do contrato:", error);
    return res.status(500).render('error', {
      message: "Erro no servidor ao buscar detalhes do contrato"
    });
  }
};

module.exports = { contractsGet, contractDetailsPartial, contractDetail };