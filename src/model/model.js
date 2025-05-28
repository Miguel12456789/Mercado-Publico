const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    dataPublicacao: { type: Date, default: Date.now },
    tiposContrato: { type: String, required: true },
    numeroAcordoQuadro: { type: Number, required: true },
    descricaoAcordoQuadro: { type: String, required: true },
    tipologiaMedidaEspecial: { type: String, required: true },
    tipoProcedimento: { type: String, required: true },
    descricao: { type: Number, required: true },
    fundamentacao: { type: String, required: true },
    fundamentacaoAjusteDireto: { type: String, required: true },
    regime: { type: String, required: true },
    criteriosMateriais: { type: String, required: true },
    entidadesAdjudicantes: { type: String, required: true },
    entidadesAdjudicatarias: { type: String, required: true },
    objetoContrato: { type: String, required: true },
    procedimentoCentralizado: { type: String, required: true },
    cpvs: { type: String, required: true },
    dataContrato: { type: Date, default: Date.now },
    precoContratual: { type: Number, required: true },
    prazoExecucao: { type: String, required: true },
    localExecucao: { type: String, required: true },
    entidadesConcorrentes: { type: String, required: true },
    anuncio: { type: String, required: true },
    pecasProcedimento: { type: String, required: true },
    modificacoesContratuais: { type: String, required: true },
    documentos: { type: String, required: true },
    observacoes: { type: String, required: true },
    criteriosAmbientais: { type: String, required: true },
    justificacaoNaoReducaoEscrito: { type: String, required: true },
    aviso: { type: String, required: true },
    causaExtincaoContrato: { type: String, required: true },
    dataFechoContrato: { type: Date, default: Date.now },
    precoTotalEfetivo: { type: Number, required: true },
    causasAlteracoesPrazo: { type: String, required: true },
    causasAlteracoesPreco: { type: String, required: true },
});

//collection Part
const base_gov = mongoose.model("Base_gov_2020", contractSchema, "Base_gov_2020");

module.exports = { base_gov };