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
      @import url('../css/components.css');
      @import url('../css/colors.css');
      @import url('../css/typography.css');
      @import url('../css/pages/statistics.css');
 
  `;

  // Conteúdo do contêiner principal para Statistics
  container.innerHTML = `
      <div class="frame">
          <div class="div">
              <div class="text-wrapper">Statistics</div>
              <button class="button">
                  <div class="icon-wrapper">
                      <img class="icon" src="img/icon-2.svg" />
                  </div>
                  <div class="button-text">Refresh</div>
              </button>
          </div>
          <div class="div-2">
              <div class="div-3">
                  <div class="statistics-metric">
                      <div class="icon-wrapper">
                          <img class="img" src="img/icon-4.svg" />
                      </div>
                      <div class="statistics-metric-2">
                          <div class="statistics-metric-3">Played Games</div>
                          <div class="statistics-metric-4">48</div>
                      </div>
                  </div>
                  <div class="statistics-metric">
                      <div class="icon-wrapper">
                          <img class="img" src="img/icon-3.svg" />
                      </div>
                      <div class="statistics-metric-2">
                          <div class="statistics-metric-3">Total Victories</div>
                          <div class="statistics-metric-4">28</div>
                      </div>
                  </div>
                  <div class="statistics-metric">
                      <div class="icon-wrapper">
                          <img class="img" src="img/icon.svg" />
                      </div>
                      <div class="statistics-metric-2">
                          <div class="statistics-metric-3">Max. Consecutive Wins</div>
                          <div class="statistics-metric-4">5</div>
                      </div>
                  </div>
                  <div class="statistics-metric">
                      <div class="icon-wrapper">
                          <img class="img" src="img/image.svg" />
                      </div>
                      <div class="statistics-metric-2">
                          <div class="statistics-metric-3">Total Points</div>
                          <div class="statistics-metric-4">240</div>
                      </div>
                  </div>
              </div>
              <div class="div-4">
                  <div class="div-5">
                      <div class="statistics-metric-5">Losses</div>
                      <div class="statistics-metric-6"></div>
                      <div class="statistics-metric-7">28</div>
                  </div>
                  <div class="div-5">
                      <div class="statistics-metric-5">Total Win Rate</div>
                      <div class="statistics-metric-6"></div>
                      <div class="statistics-metric-7">64%</div>
                  </div>
                  <div class="div-5">
                      <div class="statistics-metric-5">Total Loss Rate</div>
                      <div class="statistics-metric-6"></div>
                      <div class="statistics-metric-7">36%</div>
                  </div>
                  <div class="div-5">
                      <div class="statistics-metric-5">Average Points per Match</div>
                      <div class="statistics-metric-6"></div>
                      <div class="statistics-metric-7">3</div>
                  </div>
                  <div class="div-5">
                      <p class="statistics-metric-5">Average Points Taken per Match</p>
                      <div class="statistics-metric-6"></div>
                      <div class="statistics-metric-7">2</div>
                  </div>
              </div>
          </div>
      </div>
  `;

  container.appendChild(style);
  return container;
}
