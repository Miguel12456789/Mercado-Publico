const mongoose = require('mongoose');
const express = require('express');
const { API_2020 } = require('../model/model'); // Ajuste o caminho conforme necessário

// Modifique o contractsController:
// contractsController.js
const contractsGet = async (req, res) => {
  try {
    console.log('Query params recebidos:', req.query);

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = [25, 50, 100].includes(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 25;
    const skip = (page - 1) * limit;

    // ========================
    // FILTROS
    // ========================
    const filter = {};

    if (req.query.search?.trim()) {
      filter.objetoContrato = { $regex: req.query.search.trim(), $options: 'i' };
    }

    if (req.query['special-measures'] === 'on') {
      filter.medidasEspeciais = true;
    }

    if (req.query['include-mec'] === 'on') {
      filter.mec = true;
    }

    if (req.query['measure-type'] && req.query['measure-type'] !== 'Todos') {
      filter.tipoMedidaEspecial = req.query['measure-type'];
    }

    if (req.query['tipoProcedimento'] && req.query['tipoProcedimento'] !== '0') {
      filter.tipoprocedimento = req.query['tipoProcedimento'];
    }

    if (req.query['entidade']?.trim()) {
      filter.adjudicante = { $regex: req.query['entidade'].trim(), $options: 'i' };
    }

    if (req.query['tipoContrato'] && req.query['tipoContrato'] !== '0') {
      filter.tipoContrato = req.query['tipoContrato'];
    }

    if (req.query['adjudicatario']?.trim()) {
      filter.adjudicatarios = { $regex: req.query['adjudicatario'].trim(), $options: 'i' };
    }

    if (req.query['cpv']?.trim()) {
      filter.cpv = { $regex: req.query['cpv'].trim(), $options: 'i' };
    }

    if (req.query['environmental-criteria'] === 'on') {
      filter.criteriosAmbientais = true;
    }

    // ========================
    // CONSULTA COM FILTRO
    // ========================
    const [contracts, totalContracts] = await Promise.all([
      API_2020.find(filter).skip(skip).limit(limit).lean(),
      API_2020.countDocuments(filter)
    ]);

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

    const isAjax = req.xhr || req.headers.accept?.includes('json');

    if (isAjax) {
      return res.json({ contracts, pagination });
    }

    return res.render('base_gov', {
      contracts,
      pagination,
      includeDetails: true
    });

  } catch (error) {
    console.error('Erro completo:', error);
    return res.status(500).send('Erro no servidor');
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




module.exports = { contractsGet, contractDetail };