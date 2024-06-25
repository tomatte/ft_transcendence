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
        @import url('../css/pages/friends.css');
 
    `;

    // Conteúdo do contêiner principal  para Friends
    container.innerHTML = `
<div class="container">
    <div class="header">
        <div class="title">
            <div class="title-text">Friends</div>
            <div class="count">[25]</div>
        </div>
        <div class="add-friend">
            <div class="add-btn">Add friend</div>
        </div>
    </div>
    <div class="search">
        <input type="text" placeholder="Search for a name..." />
    </div>
    <div class="table">
        <div class="table-header">
            <div class="header-item">PLAYER</div>
            <div class="header-item">GLOBAL RANKING</div>
            <div class="header-item">LOSSES AGAINST YOU</div>
            <div class="header-item">WINS AGAINST YOU</div>
            <div class="header-item actions">ACTIONS</div>
        </div>
        <div class="table-row">
            <div class="row-item">
                <img src="https://via.placeholder.com/36x36" alt="Avatar" />
                <div class="player-info">
                    <div class="player-name">Caos</div>
                    <div class="player-username">clourenc</div>
                </div>
            </div>
            <div class="row-item">#1</div>
            <div class="row-item">5</div>
            <div class="row-item">6</div>
            <div class="row-item actions">
                <div class="action-icon">
                    <div class="icon-inner"></div>
                </div>
                <div class="action-icon">
                    <div class="icon-inner"></div>
                </div>
            </div>
        </div>
        <!-- Additional rows go here -->
    </div>
    <div class="pagination">
        <div class="pagination-item">Primeiro</div>
        <div class="pagination-item">Anterior</div>
        <div class="pagination-item">1</div>
        <div class="pagination-item">2</div>
        <!-- Add more pagination items as needed -->
        <div class="pagination-item">25</div>
        <div class="pagination-item">Próximo</div>
        <div class="pagination-item">Último</div>
    </div>
</div>

    `;

    container.appendChild(style);

    return container;
}
