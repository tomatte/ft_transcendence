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
        @import url('../css/components.css');
        @import url('../css/colors.css');
        @import url('../css/typography.css');
        @import url('../css/pages/friends.css');
     `;

    // Conteúdo do contêiner principal  para Friends
    container.innerHTML = `
   <div class="frame">
      <div class="div">
        <div class="div-2">
          <div class="div-3">
            <div class="text-wrapper">Friends</div>
            <div class="text-wrapper-2">[25]</div>
          </div>
          <button class="button"><div class="button-text">Add friend</div></button>
        </div>
        <div class="search-bar">
          <div class="icon-wrapper"><img class="icon" src="img/icon-5.svg" /></div>
          <div class="search-bar-2">Search for a name...</div>
        </div>
      </div>
      <div class="div-4">
        <div class="navbar">
          <div class="text-wrapper-3">PLAYER</div>
          <div class="text-wrapper-3">GLOBAL RANKING</div>
          <div class="text-wrapper-3">LOSSES AGAINST YOU</div>
          <div class="text-wrapper-3">WINS AGAINST YOU</div>
          <div class="text-wrapper-4">ACTIONS</div>
        </div>
        <div class="div-4">
          <div class="div-5">
            <div class="table-row-player">
              <div class="table-row-player-2"></div>
              <div class="table-row-player-3">
                <div class="table-row-player-4">Caos</div>
                <div class="table-row-player-5">clourenc</div>
              </div>
            </div>
            <div class="table-row-data"><div class="text-wrapper-5">#1</div></div>
            <div class="div-wrapper"><div class="text-wrapper-6">5</div></div>
            <div class="div-wrapper"><div class="text-wrapper-6">6</div></div>
            <div class="table-row-actions">
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="img" src="img/icon.svg" /></div>
              </div>
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="img" src="img/icon-3.svg" /></div>
              </div>
            </div>
          </div>
          <div class="div-5">
            <div class="table-row-player">
              <div class="table-row-player-6"></div>
              <div class="table-row-player-3">
                <div class="table-row-player-4">Estagario</div>
                <div class="table-row-player-5">etomiyos</div>
              </div>
            </div>
            <div class="table-row-data"><div class="text-wrapper-5">#3</div></div>
            <div class="div-wrapper"><div class="text-wrapper-6">8</div></div>
            <div class="div-wrapper"><div class="text-wrapper-6">1</div></div>
            <div class="table-row-actions">
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="img" src="img/icon.svg" /></div>
              </div>
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="img" src="img/icon-3.svg" /></div>
              </div>
            </div>
          </div>
          <div class="div-5">
            <div class="table-row-player">
              <div class="table-row-player-7"></div>
              <div class="table-row-player-3">
                <div class="table-row-player-4">Tomatte</div>
                <div class="table-row-player-5">dbrandao</div>
              </div>
            </div>
            <div class="table-row-data"><div class="text-wrapper-5">#2</div></div>
            <div class="div-wrapper"><div class="text-wrapper-6">3</div></div>
            <div class="div-wrapper"><div class="text-wrapper-6">6</div></div>
            <div class="table-row-actions">
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="img" src="img/icon.svg" /></div>
              </div>
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="img" src="img/icon-3.svg" /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <div class="pagination-control">
            <div class="icon-wrapper"><img class="icon-2" src="img/icon-4.svg" /></div>
            <div class="pagination-control-2">Primeiro</div>
          </div>
          <div class="pagination-control">
            <div class="icon-wrapper"><img class="icon-2" src="img/icon-4.svg" /></div>
            <div class="pagination-control-2">Anterior</div>
          </div>
          <div class="element"><div class="pagination-position">1</div></div>
          <div class="pagination-position-wrapper"><div class="pagination-position-2">2</div></div>
          <div class="pagination-position-wrapper"><div class="pagination-position-2">3</div></div>
          <div class="pagination-position-wrapper"><div class="pagination-position-2">4</div></div>
          <div class="pagination-position-wrapper"><div class="pagination-position-2">5</div></div>
          <div class="more">
            <div class="img-wrapper"><img class="icon-3" src="img/icon-2.svg" /></div>
          </div>
          <div class="pagination-position-wrapper"><div class="pagination-position-2">25</div></div>
          <div class="pagination-control">
            <div class="pagination-control-3">Próximo</div>
            <div class="icon-wrapper"><img class="icon-2" src="img/image.svg" /></div>
          </div>
          <div class="pagination-control">
            <div class="pagination-control-3">Último</div>
            <div class="icon-wrapper"><img class="icon-2" src="img/image.svg" /></div>
          </div>
        </div>
      </div>
    </div>
 
    `;

    container.appendChild(style);

    return container;
}
