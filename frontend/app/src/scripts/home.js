// index.js

// Função para carregar o conteúdo de uma página externa em um elemento específico
function loadContent(url, element) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            element.innerHTML = html;
        })
        .catch(error => console.error('Erro ao carregar o conteúdo:', error));
}

// Função para configurar os eventos de clique nos links do menu
function setupMenuLinks() {
    const menuItems = document.querySelectorAll('.MenuItem');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Previne o comportamento padrão de navegação
            
            const url = item.getAttribute('href'); // Obtém o URL da página a carregar
            const contentContainer = document.getElementById('content'); // Elemento onde o conteúdo será carregado
            
            loadContent(url, contentContainer); // Carrega o conteúdo da página clicada
        });
    });
}

// Função para inicializar o SPA
function initSPA() {
    setupMenuLinks(); // Configura os eventos de clique nos links do menu
}

// Inicializa o SPA quando o documento HTML estiver completamente carregado
document.addEventListener('DOMContentLoaded', initSPA);
