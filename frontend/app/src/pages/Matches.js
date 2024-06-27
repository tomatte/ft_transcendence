export default () => {
    // Criação do contêiner principal
    const container = document.createElement("div");
    container.classList.add("playground-container");

    // Criação de estilos
    const style = document.createElement("style");
    style.innerHTML = `
            @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap');
        @import url('../css/Components.css');
        @import url('../css/Colors.css');
        @import url('../css/Typography.css');
        @import url('../css/pages/matches.css');

   
    `;

    // Conteúdo do contêiner principal para Matches
    container.innerHTML = `
        <div class="header">
            <div class="title">
                <div class="title-text">Matches</div>
                <div class="badge">[8]</div>
            </div>
            <div class="filter">
                <div class="filter-item">
                    <div class="filter-icon"></div>
                    <div class="filter-label">Label</div>
                    <div class="filter-icon"></div>
                </div>
            </div>
        </div>
        <div class="matches">
            <div class="match-item">
                <div class="player-info">
                    <img class="player-avatar" src="https://via.placeholder.com/36x36" />
                    <div class="player-details">
                        <div class="player-name">Tomatte</div>
                        <div class="player-username">dbrandao</div>
                    </div>
                </div>
                <div class="game-type">Friendly Match</div>
                <div class="score">2 X 5</div>
                <div class="status">
                    <div class="status-badge defeat">Defeat</div>
                </div>
                <div class="date">22/06/2024</div>
            </div>
            <!-- Outros itens de jogo aqui -->
        </div>
        <div class="pagination">
            <div class="pagination-item">Primeiro</div>
            <div class="pagination-item">Anterior</div>
            <div class="pagination-item active">1</div>
            <div class="pagination-item">2</div>
            <div class="pagination-item">3</div>
            <div class="pagination-item">4</div>
            <div class="pagination-item">5</div>
        </div>
    `;

    container.appendChild(style);

    return container;
}
