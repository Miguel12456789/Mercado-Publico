const mongoose = require('mongoose');
const express = require('express');
const createModels = require('../model/model');

const { Parser } = require('json2csv'); // para CSV
const ExcelJS = require('exceljs');     // para XLS
const PDFDocument = require('pdfkit');  // para PDF


let API_2020, API_2021;

// Esta função vai inicializar os modelos com as conexões certas
function initModels(app) {
  const { conn1, conn2 } = app.locals;
  const models = createModels(conn1, conn2);
  API_2020 = models.API_2020;
  API_2021 = models.API_2021;
}

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
      const cpvList = req.query['cpv']
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (cpvList.length === 1) {
        filter.cpv = { $regex: cpvList[0], $options: 'i' };
      } else if (cpvList.length > 1) {
        filter.$or = cpvList.map(cpv => ({
          cpv: { $regex: cpv, $options: 'i' }
        }));
      }
    }

    if (req.query['environmental-criteria'] === 'on') {
      filter.ContratEcologico = "Sim";
    } else {
      filter.ContratEcologico = "NÃ£o";
    }
    if (req.query['pais'] && req.query['pais'].toLowerCase() !== 'todos') {
      const pais = req.query['pais'].toLowerCase().trim();
      const distrito = req.query['distrito']?.replace(/_/g, ' ').toLowerCase().trim();
      const concelho = req.query['concelho']?.replace(/_/g, ' ').toLowerCase().trim();

      let regexStr = pais;

      if (pais === 'portugal') {
        if (distrito) regexStr += `,\\s*${distrito}`;
        if (concelho) regexStr += `,\\s*${concelho}`;
      }

      // Evita aplicar filtro inválido
      if (regexStr && typeof regexStr === 'string') {
        filter.localExecucao = { $regex: new RegExp(`^${regexStr}`, 'i') };
      }
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
      "1": "dataCelebracaoContrato",
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
        } else if (['dataCelebracaoContrato', 'dataFechoContrato'].includes(field)) {
          // Converte datas para formato dd/mm/yyyy
          function formatToDDMMYYYY(date) {
            const d = String(date.getDate()).padStart(2, '0');
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const y = date.getFullYear();
            return `${d}/${m}/${y}`;
          }

          const range = {};
          if (startDate) range.$gte = formatToDDMMYYYY(startDate);
          if (endDate) range.$lte = formatToDDMMYYYY(endDate);

          filter[field] = range;
        }
      }
    }








    // ========================
    //
    // ========================

    console.log('Filtros aplicados:', filter);

    // Monta o pipeline de agregação
    const pipeline = [
      { $match: filter },
      { $sort: { dataPublicacao_datetime: -1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    // Para a contagem total (sem paginação)
    const countPipeline = [
      { $match: filter },
      { $count: "total" }
    ];

    // Executa as duas agregações em paralelo
    const [contracts2020, contracts2021, count2020, count2021] = await Promise.all([
      API_2020.aggregate(pipeline),
      API_2021.aggregate(pipeline),
      API_2020.aggregate(countPipeline),
      API_2021.aggregate(countPipeline)
    ]);

    const contracts = [...contracts2020, ...contracts2021];
    const totalContracts = (count2020[0]?.total || 0) + (count2021[0]?.total || 0);

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

    // ⚠️ Corrige a serialização do filtro localExecucao se for uma regex
    if (filter.localExecucao?.$regex instanceof RegExp) {
      filter.localExecucao = {
        $regex: filter.localExecucao.$regex.source,
        $options: 'i'
      };
    }

    if (req.session) {
      req.session.lastQuery = filter;
    }


    const isAjax = req.xhr || req.headers.accept?.includes('json');

    if (isAjax) {
      return res.json({ contracts, pagination });
    }

    return res.render('estat_mp', {
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

    // Procura primeiro na API_2020
    let contract = await API_2020.findById(id).lean();
    if (!contract) contract = await API_2021.findById(id).lean();


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


const downloadContracts = async (req, res) => {

  const headerMap = {
    nAnuncio: 'Número do Anúncio',
    TipoAnuncio: 'Tipo de Anúncio',
    idINCM: 'ID INCM',
    tipoContrato: 'Tipo de Contrato',
    idprocedimento: 'ID do Procedimento',
    tipoprocedimento: 'Tipo de Procedimento',
    objectoContrato: 'Objeto do Contrato',
    descContrato: 'Descrição do Contrato',
    adjudicante: 'Entidade Adjudicante',
    adjudicatarios: 'Entidade Adjudicatária',
    dataPublicacao: 'Data de Publicação',
    dataCelebracaoContrato: 'Data de Celebração do Contrato',
    precoContratual: 'Preço Contratual',
    cpv: 'CPV',
    prazoExecucao: 'Prazo de Execução',
    localExecucao: 'Local de Execução',
    fundamentacao: 'Fundamentação',
    ProcedimentoCentralizado: 'Procedimento Centralizado',
    numAcordoQuadro: 'Número do Acordo-Quadro',
    DescrAcordoQuadro: 'Descrição do Acordo-Quadro',
    precoBaseProcedimento: 'Preço Base do Procedimento',
    dataDecisaoAdjudicacao: 'Data de Decisão da Adjudicação',
    dataFechoContrato: 'Data de Fecho do Contrato',
    PrecoTotalEfetivo: 'Preço Total Efetivo',
    regime: 'Regime',
    justifNReducEscrContrato: 'Justificativo da Não Redução a Escrita',
    tipoFimContrato: 'Tipo de Fim do Contrato',
    CritMateriais: 'Critérios Materiais',
    concorrentes: 'Número de Concorrentes',
    linkPecasProc: 'Link das Peças do Procedimento',
    Observacoes: 'Observações',
    ContratEcologico: 'Contrato Ecológico',
    Ano: 'Ano',
    fundamentAjusteDireto: 'Fundamentação do Ajuste Direto',
    dataPublicacao_datetime: 'Data de Publicação (Datetime)'
  };

  try {
    const format = req.query.format || 'csv';
    const filters = req.session?.lastQuery || {}; // guarda os filtros aplicados

    // Reconstrói a RegExp do campo localExecucao, se necessário
    if (filters.localExecucao?.$regex && typeof filters.localExecucao.$regex === 'string') {
      filters.localExecucao = {
        $regex: new RegExp(filters.localExecucao.$regex, filters.localExecucao.$options || '')
      };
    }

    // Aplicar os mesmos filtros usados na pesquisa
    const contratos2020 = await API_2020.find(filters).lean();
    const contratos2021 = await API_2021.find(filters).lean();
    const contratos = [...contratos2020, ...contratos2021]; // ou usa o aggregation se necessário

    const contratosLimpos = contratos.map(c => {
      const novoContrato = {};

      Object.entries(c).forEach(([key, value]) => {
        if (['_id', 'idcontrato'].includes(key)) return;

        let val = value === null || value === undefined || value === '' ? 'Não aplicável' : value;

        // ✂️ Limpa quebras de linha e múltiplos espaços
        if (typeof val === 'string') {
          val = val.replace(/\s+/g, ' ').trim();
        }

        novoContrato[key] = val;
      });

      return novoContrato;
    });


    if (format === 'csv') {
      const fields = Object.keys(contratosLimpos[0] || []).map(key => ({
        label: headerMap[key] || key,
        value: key
      }));

      const parser = new Parser({
        fields,
        delimiter: ';', // <-- Use ponto e vírgula como separador
        quote: '"',
        withBOM: true
      });

      let csv = parser.parse(contratosLimpos);

      const replacements = {
        'Nã£o': 'Não',
        'AquisiÃ§Ã£o': 'Aquisição',
        'PrÃ©via': 'Prévia',
        'Ã³': 'ó', 'Ã§': 'ç', 'Ã£': 'ã', 'Ãª': 'ê',
        'Ãº': 'ú', 'Ã¡': 'á', 'Ã­': 'í', 'Ã´': 'ô',
        'Ã“': 'Ó', 'Ã‰': 'É'
      };

      for (const [errado, certo] of Object.entries(replacements)) {
        csv = csv.replace(new RegExp(errado, 'g'), certo);
      }

      res.setHeader('Content-Disposition', 'attachment; filename=contratos.csv');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      return res.send(csv);
    }



    if (format === 'xls') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Contratos');

      worksheet.columns.forEach(col => {
        let maxLength = col.header.length;
        col.eachCell({ includeEmpty: true }, cell => {
          const val = cell.value ? cell.value.toString().length : 0;
          if (val > maxLength) maxLength = val;
        });
        col.width = Math.min(maxLength + 2, 50); // Máximo de 50 para evitar colunas enormes
      });
      worksheet.addRows(contratosLimpos);

      res.setHeader('Content-Disposition', 'attachment; filename=contratos.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      await workbook.xlsx.write(res);
      return res.end();
    }

    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Disposition', 'attachment; filename=contratos.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);

      contratosLimpos.forEach(c => {
        Object.entries(c).forEach(([key, value]) => {
          const texto = `${key}: ${value}`;
          doc.text(texto, {
            width: 500, // ou outro valor de largura adequado
            continued: false
          });
        });
        doc.moveDown();
      });

      doc.end();
      return;
    }

    return res.status(400).send('Formato inválido.');
  } catch (err) {
    console.error('Erro ao exportar contratos:', err);
    res.status(500).send('Erro ao gerar ficheiro.');
  }
};



module.exports = { contractsGet, contractDetail, downloadContracts, initModels };