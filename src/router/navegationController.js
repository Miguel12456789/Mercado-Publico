// Renderiza a pagina normalmente
const renderPage = (page) => (req, res) => {
    res.render(page);
};;

const home = renderPage("home");
const API_2020 = renderPage("API_2020")
const tab_mp = renderPage("tab_mp")
const sPub = renderPage("sPub")
const estat_spri = renderPage("estat_spri")
const op_cp = renderPage("op_cp")
const outros = renderPage("outros")

const detalhescontrato = renderPage("detalhescontrato")

module.exports = { home, API_2020, sPub, estat_spri, op_cp, outros, tab_mp, detalhescontrato };