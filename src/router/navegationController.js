// Renderiza a pagina normalmente
const renderPage = (page) => (req, res) => {
    res.render(page, {
        navFile: 'nav',
        footerFile: 'footer',
    });
};

const home = renderPage("home");
const API_2020 = renderPage("API_2020")
const tab_base = renderPage("tab_base")
const estatisticas_setor_publico = renderPage("estatisticas_setor_publico")
const estatisticas_setor_privado = renderPage("estatisticas_setor_privado")
const oportunidade_contratacao_publica = renderPage("oportunidade_contratacao_publica")
const outros = renderPage("outros")

module.exports = { home, API_2020, estatisticas_setor_publico, estatisticas_setor_privado, oportunidade_contratacao_publica, outros, tab_base };