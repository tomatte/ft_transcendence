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
    <div class="page-content">
      <div class="div">
        <div class="div-2">
          <div class="div-3">
            <div class="text-wrapper">Matches</div>
            <div class="text-wrapper-2">[8]</div>
          </div>
        <button class="button button--primary">
            <span class="material-icons-round button__icon-left">sports_esports</span>
            <span class="button__text font-body-regular-bold">Click me!</span>
            <span class="material-icons-round button__icon-right">sports_esports</span>
        </button>
        </div>
        <div class="div-4">
          <div class="navbar">
            <div class="table-header-group">PLAYER</div>
            <div class="table-header-group">GAME TYPE</div>
            <div class="table-header-group">SCORE</div>
            <div class="table-header-group">STATUS</div>
            <div class="table-header-group">DATE</div>
          </div>
          <div class="table-row-group">
            <div class="table-row-group-row">
              <div class="div-5">
                <div class="table-row-player"></div>
                <div class="table-row-player-2">
                  <div class="table-row-player-3">Tomatte</div>
                  <div class="table-row-player-4">dbrandao</div>
                </div>
              </div>
              <div class="div-wrapper"><div class="text-wrapper-3">Friendly Match</div></div>
              <div class="div-wrapper"><div class="text-wrapper-3">2 X 5</div></div>
        <span class="tag tag--defeat">
            <span class="tag__text font-body-regular-bold">Defeat</span>
        </span>
              <div class="div-wrapper"><div class="text-wrapper-3">22/06/2024</div></div>
            </div>
            <div class="table-row-group-row">
              <div class="div-5">
                <div class="table-row-player-5"></div>
                <div class="table-row-player-2">
                  <div class="table-row-player-3">Tomatte</div>
                  <div class="table-row-player-4">dbrandao</div>
                </div>
              </div>
              <div class="div-wrapper"><div class="text-wrapper-3">Tournament</div></div>
              <div class="div-wrapper"><div class="text-wrapper-3">2 X 1</div></div>
              <div class="div-wrapper">
                <div class="tag-text-wrapper"><div class="tag-text-2">Victory</div></div>
              </div>
              <div class="div-wrapper"><div class="text-wrapper-3">22/06/2024</div></div>
            </div>
            <div class="table-row-group-row">
              <div class="div-5">
                <div class="table-row-player-6"></div>
                <div class="table-row-player-2">
                  <div class="table-row-player-3">Tomatte</div>
                  <div class="table-row-player-4">dbrandao</div>
                </div>
              </div>
              <div class="div-wrapper"><div class="text-wrapper-3">1V1 Match</div></div>
              <div class="div-wrapper"><div class="text-wrapper-3">5 X 2</div></div>
        <span class="tag tag--victory">
            <span class="tag__text font-body-regular-bold">Victory</span>
        </span>
              <div class="div-wrapper"><div class="text-wrapper-3">22/06/2024</div></div>
            </div>
            <div class="table-row-group-row">
              <div class="div-5">
                <div class="table-row-player-7"></div>
                <div class="table-row-player-2">
                  <div class="table-row-player-3">Tomatte</div>
                  <div class="table-row-player-4">dbrandao</div>
                </div>
              </div>
              <div class="div-wrapper"><div class="text-wrapper-3">Friendly Match</div></div>
              <div class="div-wrapper"><div class="text-wrapper-3">2 X 4</div></div>
              <div class="div-wrapper">
                <div class="tag"><div class="tag-text">Defeat</div></div>
              </div>
              <div class="div-wrapper"><div class="text-wrapper-3">22/06/2024</div></div>
            </div>
            <div class="table-row-group-row">
              <div class="div-5">
                <div class="table-row-player-8"></div>
                <div class="table-row-player-2">
                  <div class="table-row-player-3">Tomatte</div>
                  <div class="table-row-player-4">dbrandao</div>
                </div>
              </div>
              <div class="div-wrapper"><div class="text-wrapper-3">Friendly Match</div></div>
              <div class="div-wrapper"><div class="text-wrapper-3">4 X 1</div></div>
              <div class="div-wrapper">
                <div class="tag-text-wrapper"><div class="tag-text-2">Victory</div></div>
              </div>
              <div class="div-wrapper"><div class="text-wrapper-3">22/06/2024</div></div>
            </div>
          </div>
          <div class="pagination"></div>
        </div>
      </div>
    </div>
    `;

    // Adiciona o estilo ao contêiner
    container.appendChild(style);

    return container;
}

