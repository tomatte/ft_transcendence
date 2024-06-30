const Friends = () => {
  const component = document.createElement('div');
  component.innerHTML = `
  			<div class="page-content__container__header">
				<div class="page-content__container__header__info">
					<h4 class="page-content__container__header__info__title">Friends</h4>
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
return component;
};

export default Friends;