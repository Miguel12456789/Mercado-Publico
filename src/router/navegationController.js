// Renderiza a pagina normalmente
const renderPage = (page) => (req, res) => {
    res.render(page);
};;

const home = renderPage("home");
const API_2020 = renderPage("API_2020")
const tab_mp = renderPage("tab_mp")
const sPub = renderPage("sPub")
const sPri = renderPage("sPri")
const op_cp = renderPage("op_cp")
const outros = renderPage("outros")

const detalhescontrato = renderPage("detalhescontrato")
const tab_sPub = renderPage("tab_sPub")
const detalhes_sPub = renderPage("detalhes_sPub")

module.exports = { home, API_2020, sPub, sPri, op_cp, outros, tab_mp, detalhescontrato, tab_sPub, detalhes_sPub };