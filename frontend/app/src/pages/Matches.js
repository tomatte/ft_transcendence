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
        @import url('../css/pages/matches.css');
    `;

    // Conteúdo do contêiner principal para Matches
    container.innerHTML = `
<div class="frame">
  <div class="div">
                <div class="game-mode-banner__info">
                    <div class="game-mode-banner__info__title">MATCHES</div>
      <button class="button">
        <div class="icon-wrapper"><img class="icon" src="img/image.svg" /></div>
        <div class="button-text">Share your Matches</div>
      </button>
    </div>

    <div class="search-bar">
        <span class="material-icons-round search-bar__icon icon--regular">search</span>
        <input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name...">
    </div>
  </div>

  <div class="div-3">
    <table class="custom-table">
      <thead>
        <tr class="font-body-caption-regular">
          <th>PLAYER</th>
          <th>GAME TYPE</th>
          <th>SCORE</th>
          <th>STATUS</th>
          <th>DATE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Caos</td>
          <td>Single Player</td>
          <td>102</td>
          <td>Active</td>
          <td>2024-06-28</td>
        </tr>
        <tr>
          <td>Caos</td>
          <td>Multiplayer</td>
          <td>80</td>
          <td>Inactive</td>
          <td>2024-06-27</td>
        </tr>
        <tr>
          <td>Caos</td>
          <td>Single Player</td>
          <td>66</td>
          <td>Active</td>
          <td>2024-06-26</td>
        </tr>
        <tr>
          <td>Caos</td>
          <td>Multiplayer</td>
          <td>15</td>
          <td>Inactive</td>
          <td>2024-06-25</td>
        </tr>
        <tr>
          <td>Caos</td>
          <td>Single Player</td>
          <td>30</td>
          <td>Active</td>
          <td>2024-06-24</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="pagination">
    <div class="pagination-control">
      <div class="icon-wrapper"><img class="icon-3" src="img/icon-5.svg" /></div>
      <div class="pagination-control-2">Primeiro</div>
    </div>
    <div class="pagination-control">
      <div class="icon-wrapper"><img class="icon-3" src="img/icon-5.svg" /></div>
      <div class="pagination-control-2">Anterior</div>
    </div>
    <div class="element"><div class="pagination-position">1</div></div>
    <div class="pagination-position-wrapper"><div class="pagination-position-2">2</div></div>
    <div class="pagination-position-wrapper"><div class="pagination-position-2">3</div></div>
    <div class="pagination-position-wrapper"><div class="pagination-position-2">4</div></div>
    <div class="pagination-position-wrapper"><div class="pagination-position-2">5</div></div>
    <div class="more">
      <div class="img-wrapper"><img class="icon" src="img/icon-6.svg" /></div>
    </div>
    <div class="pagination-position-wrapper"><div class="pagination-position-2">25</div></div>
    <div class="pagination-control">
      <div class="pagination-control-3">Próximo</div>
      <div class="icon-wrapper"><img class="icon-3" src="img/icon-2.svg" /></div>
    </div>
    <div class="pagination-control">
      <div class="pagination-control-3">Último</div>
      <div class="icon-wrapper"><img class="icon-3" src="img/icon-2.svg" /></div>
    </div>
  </div>
</div>

    `;

    // Adiciona o estilo ao contêiner
    container.appendChild(style);

    return container;
}

