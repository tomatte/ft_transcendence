// Função para lidar com navegação através das rotas
const route = (event) => {
  event.preventDefault(); // Prevenir o comportamento padrão do link

  // Obter o caminho da rota a partir do atributo href do link clicado
  const path = event.target.getAttribute("href");

  // Alterar o estado da história do navegador para refletir a nova rota
  window.history.pushState({}, "", path);

  // Carregar o conteúdo da página correspondente ao caminho
  handleLocation(path);
};




// Objeto que mapeia rotas para arquivos HTML correspondentes
const routes = {
  "/": "/pages/index.html",
  "/Matches": "templates/pages/Matches.html",
  "/Friends": "/pages/Friends.html",
  "/Ranking": "/pages/Ranking.html",
  "/Statistics": "/pages/Statistics.html",
  "/Notifications": "/pages/Notifications.html",
  "404": "/pages/404.html", // Página de erro 404
};

// Função para lidar com navegação através das rotas
const route = (event) => {
  event.preventDefault(); // Prevenir o comportamento padrão do link

  // Obter o caminho da rota a partir do atributo href do link clicado
  const path = event.target.getAttribute("href");

  // Alterar o estado da história do navegador para refletir a nova rota
  window.history.pushState({}, "", path);

  // Carregar o conteúdo da página correspondente ao caminho
  handleLocation(path);
};

// Função assíncrona para carregar o conteúdo da página com base no caminho da rota
const handleLocation = async (path) => {
  // Selecionar o arquivo HTML correspondente ao caminho da rota
  const routePath = routes[path] || routes["404"]; // Se a rota não existir, carrega a página 404

  try {
    // Realizar uma requisição assíncrona para obter o conteúdo HTML do arquivo
    const response = await fetch(routePath);
    if (!response.ok) {
      throw new Error("Erro ao carregar página.");
    }
    const html = await response.text();

    // Inserir o conteúdo HTML obtido na div com o id "main-page" no documento
    document.getElementById("main-page").innerHTML = html;
  } catch (error) {
    console.error(error);
    // Lógica para lidar com erros de carregamento de página aqui
    document.getElementById("main-page").innerHTML = "Página não encontrada.";
  }
};

// Definir a função handleLocation para ser chamada quando o estado de navegação mudar
window.onpopstate = () => handleLocation(window.location.pathname);

// Expor a função route para ser acessada globalmente
window.route = route;
