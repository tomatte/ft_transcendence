const Ranking = () => {
  const component = document.createElement('div');
  component.innerHTML = `
    <div class="frame">
      <div class="div">
        <div class="div-2">
                <div class="game-mode-banner__info">
                    <div class="game-mode-banner__info__title">RANKING</div>
          <button class="button">
            <div class="icon-wrapper"><img class="icon" src="img/image.svg" /></div>
            <div class="button-text">Share your ranking</div>
          </button>
        </div>

        <div class="search-bar">
            <span class="material-icons-round search-bar__icon icon--regular">search</span>
            <input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name...">
        </div>
      </div>

      <table class="custom-table">
          <thead>
              <tr class="font-body-caption-regular">
                  <th>PLAYER</th>
                  <th>TOTAL SCORE</th>
                  <th>WINS</th>
                  <th>LOSSES</th>
                  <th>WIN RATE</th>
                  <th>LOSS RATE</th>
                  <th>ACTIONS</th>
              </tr>
          </thead>
          <tbody>
      </table>

      <div class="div-3">
        <div class="div-4">
          <div class="table-row-data-rank"><div class="text-wrapper-5">#1</div></div>
          <div class="table-row-player">
            <div class="table-row-player-2"></div>
            <div class="table-row-player-3">
              <div class="table-row-player-4">Caos</div>
              <div class="table-row-player-5">clourenc</div>
            </div>
          </div>
          <div class="table-row-data"><div class="text-wrapper-6">102</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">80</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">15</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">66%</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">30%</div></div>
          <div class="table-row-actions">

            </div>
          </div>
        </div>
        <div class="div-4">
          <div class="table-row-data-rank"><div class="text-wrapper-5">#2</div></div>
          <div class="table-row-player">
            <div class="table-row-player-6"></div>
            <div class="table-row-player-3">
              <div class="table-row-player-4">Caos</div>
              <div class="table-row-player-5">clourenc</div>
            </div>
          </div>
          <div class="table-row-data"><div class="text-wrapper-6">102</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">80</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">15</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">66%</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">30%</div></div>
          <div class="table-row-actions-2">


          </div>
        </div>
        <div class="div-4">
          <div class="table-row-data-rank"><div class="text-wrapper-5">#3</div></div>
          <div class="table-row-player">
            <div class="table-row-player-7"></div>
            <div class="table-row-player-3">
              <div class="table-row-player-4">Caos</div>
              <div class="table-row-player-5">clourenc</div>
            </div>
          </div>
          <div class="table-row-data"><div class="text-wrapper-6">102</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">80</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">15</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">66%</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">30%</div></div>
          <div class="table-row-actions-2">

          </div>
        </div>
        <div class="div-4">
          <div class="table-row-data-rank"><div class="text-wrapper-5">#4</div></div>
          <div class="table-row-player">
            <div class="table-row-player-8"></div>
            <div class="table-row-player-3">
              <div class="table-row-player-4">Caos</div>
              <div class="table-row-player-5">clourenc</div>
            </div>
          </div>
          <div class="table-row-data"><div class="text-wrapper-6">102</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">80</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">15</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">66%</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">30%</div></div>
          <div class="table-row-actions">

          </div>
        </div>
        <div class="div-4">
          <div class="table-row-data-rank"><div class="text-wrapper-5">#5</div></div>
          <div class="table-row-player">
            <div class="table-row-player-9"></div>
            <div class="table-row-player-3">
              <div class="table-row-player-4">Caos</div>
              <div class="table-row-player-5">clourenc</div>
            </div>
          </div>
          <div class="table-row-data"><div class="text-wrapper-6">102</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">80</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">15</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">66%</div></div>
          <div class="table-row-data"><div class="text-wrapper-6">30%</div></div>
          <div class="table-row-actions">

          </div>
        </div>
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
    return component;
  };
  
  export default Ranking;