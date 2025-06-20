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
      filter.objectoContrato = { $regex: req.query.search.trim(), $options: 'i' };
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

    const procedimentoMap = {
      1: "Ajuste Direto Regime Geral",
      2: "Concurso público",
      3: "Concurso limitado por prévia qualificação",
      4: "Procedimento de negociação",
      5: "Diálogo concorrencial",
      6: "Ao abrigo de acordo-quadro (art.º 258.º)",
      7: "Ao abrigo de acordo-quadro (art.º 259.º)",
      8: "Consulta Prévia",
      9: "Parceria para a inovação",
      10: "Disponibilização de bens móveis",
      11: "Serviços sociais e outros serviços específicos",
      13: "Concurso de conceção simplificado",
      14: "Concurso de ideias simplificado",
      15: "Consulta Prévia Simplificada",
      16: "Concurso público simplificado",
      17: "Concurso limitado por prévia qualificação simplificado",
      18: "Ajuste Direto Regime Geral ao abrigo do artigo 7º da Lei n.º 30/2021, de 21.05",
      19: "Consulta prévia ao abrigo do artigo 7º da Lei n.º 30/2021, de 21.05",
      20: "Ajuste direto simplificado",
      21: "Ajuste direto simplificado ao abrigo da Lei n.º 30/2021, de 21.05",
      22: "Setores especiais - isenção parte II",
      23: "Contratação excluída II",
    };

    if (req.query['tipoProcedimento'] && req.query['tipoProcedimento'] !== '0') {
      const procedimentoStr = procedimentoMap[parseInt(req.query['tipoProcedimento'])];
      if (procedimentoStr) {
        filter.tipoprocedimento = procedimentoStr;
      }
    }

    if (req.query['entidade']?.trim()) {
      filter.adjudicante = { $regex: req.query['entidade'].trim(), $options: 'i' };
    }

    const tipoContratoMap = {
      1: "Aquisição de bens móveis",
      2: "Aquisição de serviços",
      3: "Concessão de obras públicas",
      4: "Concessão de serviços públicos",
      5: "Empreitadas de obras públicas",
      6: "Locação de bens móveis",
      7: "Sociedade",
      8: "Outros"
    };

    if (req.query['tipoContrato'] && req.query['tipoContrato'] !== '0') {
      const tipoContratoStr = tipoContratoMap[parseInt(req.query['tipoContrato'])];
      if (tipoContratoStr) {
        filter.tipoContrato = tipoContratoStr;
      }
    }


    if (req.query['adjudicatario']?.trim()) {
      filter.adjudicatarios = { $regex: req.query['adjudicatario'].trim(), $options: 'i' };
    }

    if (req.query['cpv']?.trim()) {
      filter.cpv = { $regex: req.query['cpv'].trim(), $options: 'i' };
    }

    if (req.query['environmental-criteria'] === 'on') {
      filter.ContratEcologico = "Sim";
    } else {
      filter.ContratEcologico = "NÃ£o";
    }
    if (req.query['pais'] && req.query['pais'].toLowerCase() !== 'todos') {
      const pais = req.query['pais'].toLowerCase();
      const distrito = req.query['distrito']?.replace(/_/g, ' ').toLowerCase();
      const concelho = req.query['concelho']?.replace(/_/g, ' ').toLowerCase();

      let regexStr = pais;

      if (pais === 'portugal') {
        if (distrito) regexStr += `,\\s*${distrito}`;
        if (concelho) regexStr += `,\\s*${concelho}`;
      }

      // Aplica filtro com regex (exato ou parcial, conforme os níveis escolhidos)
      filter.localExecucao = { $regex: new RegExp(`^${regexStr}`, 'i') };
    }


    const {
      'date-type': dateTypeValue,
      'from-year': fy,
      'from-month': fm,
      'from-day': fd,
      'to-year': ty,
      'to-month': tm,
      'to-day': td
    } = req.query;

    // Mapeia os valores do dropdown
    const dateFieldMap = {
      "0": "dataPublicacao_datetime",
      "1": "dataContrato_datetime",       // se não existir, ignore
      "2": "dataFechoContrato"
    };

    const field = dateFieldMap[dateTypeValue];

    function buildDate(y, m, d, isEnd = false) {
      if (!y) return null;

      const year = parseInt(y);
      const month = m ? parseInt(m) : (isEnd ? 12 : 1);
      let day = d ? parseInt(d) : (isEnd ? new Date(year, month, 0).getDate() : 1);

      const safeMonth = String(month).padStart(2, '0');
      const safeDay = String(day).padStart(2, '0');
      const hour = isEnd ? '23:59:59' : '00:00:00';

      const date = new Date(`${year}-${safeMonth}-${safeDay}T${hour}Z`);
      return isNaN(date.getTime()) ? null : date;
    }

    if (field) {
      const startDate = buildDate(fy, fm, fd, false);
      const endDate = buildDate(ty, tm, td, true);

      if (startDate || endDate) {
        if (field === 'dataPublicacao_datetime') {
          filter[field] = {};
          if (startDate) filter[field].$gte = startDate;
          if (endDate) filter[field].$lte = endDate;
        } else if (field === 'dataFechoContrato') {
          // Assumindo que dataFechoContrato é STRING (yyyy-mm-dd)
          const range = {};
          if (startDate) range.$gte = startDate.toISOString().split('T')[0];
          if (endDate) range.$lte = endDate.toISOString().split('T')[0];
          filter[field] = range;
        }
      }
    }





    // ========================
    // CONSULTA COM FILTRO
    // ========================

    console.log('Filtros aplicados:', filter);

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