export default () => {
    // Criação do contêiner principal
    const container = document.createElement("div");
    container.classList.add("playground-container");

    // Adição de estilos
    const style = document.createElement("style");
    style.innerHTML = `
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap');
        @import url('../css/Components.css');
        @import url('../css/Colors.css');
        @import url('../css/Typography.css');
        @import url('playground.css');
        @import url('../css/pages/ranking.css');
        .game-mode-banner {
            margin-bottom: 20px; /* Adiciona espaço entre os blocos */
        }
    `;

    // Conteúdo do contêiner principal para Ranking
    container.innerHTML = `
        <div style="width: 100%; height: 100%; padding: 24px;">
            <!-- Bloco de ranking geral -->
            <div class="game-mode-banner game-mode-banner--general-ranking">
                <div class="game-mode-banner__info">
                    <div class="game-mode-banner__info__title">GENERAL RANKING</div>
                    <div class="game-mode-banner__info__button">
                        <button class="button button--primary">
                            <span class="material-icons-round button__icon-left">leaderboard</span>
                            <span class="button__text font-body-regular-bold">View all</span>
                        </button>
                    </div>
                </div>
                <div class="game-mode-banner__illustration">
                    <img class="game-mode-banner__illustration__image" src="../assets/ranking.png" alt="">
                </div>
            </div>

            <!-- Bloco de ranking por categoria -->
            <div class="game-mode-banner game-mode-banner--category-ranking">
                <div class="game-mode-banner__info">
                    <div class="game-mode-banner__info__title">CATEGORY RANKING</div>
                    <div class="game-mode-banner__info__button">
                        <button class="button button--secondary">
                            <span class="material-icons-round button__icon-left">category</span>
                            <span class="button__text font-body-regular-bold">View categories</span>
                        </button>
                    </div>
                </div>
                <div class="game-mode-banner__illustration">
                    <img class="game-mode-banner__illustration__image" src="../assets/category-ranking.png" alt="">
                </div>
            </div>
        </div>
    `;

    container.appendChild(style);
    return container;
}
