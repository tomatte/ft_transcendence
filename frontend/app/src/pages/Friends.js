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
      <div class="text-wrapper">Friends</div>
      <button class="button">
        <div class="icon-wrapper"><img class="icon" src="img/image.svg" /></div>
        <div class="button-text">Share your Friends</div>
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
          <th>GLOBAL RANKING</th>
          <th>LOSSES AGAINST YOU</th>
          <th>WINS AGAINST YOU</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Caos</td>
          <td>#1</td>
          <td>15</td>
          <td>66%</td>
          <td>
            <div class="table-row-actions">
              <div class="button-add">
                <div class="button-types"><div class="button-text-2">Add friend</div></div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>Caos</td>
          <td>#2</td>
          <td>80</td>
          <td>30%</td>
          <td>
            <div class="table-row-actions-2">
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="icon-2" src="img/icon.svg" /></div>
              </div>
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="icon-2" src="img/icon-4.svg" /></div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>Caos</td>
          <td>#3</td>
          <td>15</td>
          <td>66%</td>
          <td>
            <div class="table-row-actions-2">
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="icon-2" src="img/icon.svg" /></div>
              </div>
              <div class="game-row-option">
                <div class="icon-wrapper"><img class="icon-2" src="img/icon-4.svg" /></div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>Caos</td>
          <td>#4</td>
          <td>15</td>
          <td>66%</td>
          <td>
            <div class="table-row-actions">
              <div class="button-add">
                <div class="button-types"><div class="button-text-2">Add friend</div></div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>Caos</td>
          <td>#5</td>
          <td>15</td>
          <td>66%</td>
          <td>
            <div class="table-row-actions">
              <div class="button-add">
                <div class="button-types"><div class="button-text-2">Add friend</div></div>
              </div>
            </div>
          </td>
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

    container.appendChild(style);

    return container;
}
