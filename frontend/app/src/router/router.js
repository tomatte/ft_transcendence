export default () => {
    const defaultHash = "#game"; // Define o hash padrão
    const tabs = document.getElementById("menu"); // Obtém o elemento que contém as abas
  
    /**
     * Função para mostrar a aba correspondente ao elemento de aba fornecido
     * @param {HTMLElement} tab - O elemento da aba a ser mostrada
     */
    function showTab(tab) {
      if (tab) {
        new bootstrap.Tab(tab).show();
      }
    }
  
    /**
     * Evento de clique nas abas
     */
    tabs.addEventListener("click", (e) => {
      const clickedTab = e.target.closest('[role="tab"]');
      if (clickedTab && clickedTab.getAttribute("aria-selected") === "false") {
        history.pushState(null, null, clickedTab.hash); // Atualiza o URL com o hash da aba clicada
        showTab(clickedTab); // Mostra a aba clicada
      }
    });
  
    /**
     * Evento de navegação do histórico (popstate)
     */
    window.addEventListener("popstate", () => {
      const targetTab = tabs.querySelector(`a[href="${window.location.hash || defaultHash}"]`);
      showTab(targetTab); // Mostra a aba correspondente ao hash atual do URL ou ao hash padrão
    });
  
    /**
     * Inicializa a aba correta com base no hash atual do URL ou no hash padrão
     */
    const initialTab = tabs.querySelector(`a[href="${window.location.hash || defaultHash}"]`);
    if (!initialTab) {
      history.replaceState(null, null, defaultHash); // Atualiza o URL para o hash padrão se não houver aba correspondente
      showTab(tabs.querySelector(`a[href="${defaultHash}"]`)); // Mostra a aba padrão
    } else {
      showTab(initialTab); // Mostra a aba inicial correspondente ao hash
    }
  };