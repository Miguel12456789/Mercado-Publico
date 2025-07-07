const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    idcontrato: { type: Number, required: true },
    nAnuncio: { type: String, required: true },
    TipoAnuncio: { type: String, required: true },
    idINCM: { type: String, required: true },
    tipoContrato: { type: String, required: true },
    idprocedimento: { type: String, required: true },
    tipoprocedimento: { type: String, required: true },
    objectoContrato: { type: String, required: true },
    descContrato: { type: String, required: true },
    adjudicante: { type: String, required: true },
    adjudicatarios: { type: String, required: true },
    dataPublicacao: { type: String, required: true },
    dataCelebracaoContrato: { type: String, required: true },
    precoContratual: { type: String, required: true },
    cpv: { type: String, required: true },
    prazoExecucao: { type: Number, required: true },
    localExecucao: { type: String, required: true },
    fundamentacao: { type: String, required: true },
    ProcedimentoCentralizado: { type: String, required: true },
    numAcordoQuadro: { type: String, required: true },
    DescrAcordoQuadro: { type: String, required: true },
    precoBaseProcedimento: { type: String, required: true },
    dataDecisaoAdjudicacao: { type: String, required: true },
    dataFechoContrato: { type: String, required: true },
    PrecoTotalEfetivo: { type: String, required: true },
    regime: { type: String, required: true },
    justifNReducEscrContrato: { type: String, required: true },
    tipoFimContrato: { type: String, required: true },
    CritMateriais: { type: String, required: true },
    concorrentes: { type: String, required: true },
    linkPecasProc: { type: String, required: true },
    Observacoes: { type: String, required: true },
    ContratEcologico: { type: String, required: true },
    Ano: { type: Number, required: true },
    fundamentAjusteDireto: { type: String, required: true },
    dataPublicacao_datetime: { type: Date, default: Date.now },
});

//collection Part
function createModels(conn1, conn2) {
  const API_2020 = conn1.model("API_2020", contractSchema, "API_2020");
  const API_2021 = conn2.model("API_2021", contractSchema, "API_2021");
  return { API_2020, API_2021 };
}

module.exports = createModels;