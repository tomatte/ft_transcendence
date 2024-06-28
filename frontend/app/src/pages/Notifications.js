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
        @import url('../css/pages/notification.css');
  
    `;

    // Conteúdo do contêiner principal para Notifications
    container.innerHTML = `
    <div class="frame">
      <div class="div">
        <div class="div-wrapper"><div class="text-wrapper">Notifications</div></div>
        <button class="button">
          <div class="button-icon-left"><img class="icon" src="img/icon-4.svg" /></div>
          <div class="button-text">Refresh</div>
        </button>
      </div>
      <div class="div-2">
        <div class="div-3">
          <div class="table-row-message">
            <div class="table-row-message-2"></div>
            <div class="table-row-message-3">
              <p class="p">Caos has challenged you to a friendly match</p>
              <div class="table-row-message-4">22/06/2024 - 15H30</div>
            </div>
          </div>
          <div class="table-row-actions">
            <button class="button-2">
              <div class="button-icon-left"><img class="icon" src="img/icon.svg" /></div>
              <div class="button-text-2">Play match</div>
            </button>
            <button class="button-3">
              <div class="button-icon-left"><img class="icon" src="img/icon-3.svg" /></div>
              <div class="button-text-3">Decline match</div>
            </button>
          </div>
        </div>
        <div class="div-3">
          <div class="table-row-message">
            <div class="table-row-message-5"></div>
            <div class="table-row-message-3">
              <p class="p">Caos has challenged you to a friendly match</p>
              <div class="table-row-message-4">22/06/2024 - 15H30</div>
            </div>
          </div>
          <div class="table-row-actions">
            <button class="button-2">
              <div class="button-icon-left"><img class="icon" src="img/icon-2.svg" /></div>
              <div class="button-text-2">Play match</div>
            </button>
            <button class="button-3">
              <div class="button-icon-left"><img class="icon" src="img/icon-5.svg" /></div>
              <div class="button-text-3">Decline match</div>
            </button>
          </div>
        </div>
        <div class="div-3">
          <div class="table-row-message">
            <div class="table-row-message-6"></div>
            <div class="table-row-message-3">
              <p class="p">Caos has challenged you to a friendly match</p>
              <div class="table-row-message-4">22/06/2024 - 15H30</div>
            </div>
          </div>
          <div class="table-row-actions">
            <button class="button-2">
              <div class="button-icon-left"><img class="icon" src="img/icon-2.svg" /></div>
              <div class="button-text-2">Play match</div>
            </button>
            <button class="button-3">
              <div class="button-icon-left"><img class="icon" src="img/icon-5.svg" /></div>
              <div class="button-text-3">Decline match</div>
            </button>
          </div>
        </div>
        <div class="div-3">
          <div class="table-row-message">
            <div class="table-row-message-7"></div>
            <div class="table-row-message-3">
              <p class="p">Tomatte has invited you to a tournament</p>
              <div class="table-row-message-4">22/06/2024 - 15H30</div>
            </div>
          </div>
          <div class="table-row-actions">
            <button class="button-4">
              <div class="button-icon-left"><img class="icon" src="img/icon-6.svg" /></div>
              <div class="button-text-4">Play tournament</div>
            </button>
            <button class="button-3">
              <div class="button-icon-left"><img class="icon" src="img/icon-5.svg" /></div>
              <div class="button-text-3">Decline invitation</div>
            </button>
          </div>
        </div>
        <div class="div-3">
          <div class="table-row-message">
            <div class="table-row-message-8"></div>
            <div class="table-row-message-3">
              <p class="p">Estagiario has sent you a friend request</p>
              <div class="table-row-message-4">22/06/2024 - 15H30</div>
            </div>
          </div>
          <div class="table-row-actions">
            <button class="button-5">
              <div class="button-icon-left"><img class="icon" src="img/image.svg" /></div>
              <div class="button-text-5">Accept request</div>
            </button>
            <button class="button-3">
              <div class="button-icon-left"><img class="icon" src="img/icon-5.svg" /></div>
              <div class="button-text-3">Decline request</div>
            </button>
          </div>
        </div>
        <div class="div-3">
          <div class="table-row-message">
            <div class="table-row-message-9"></div>
            <div class="table-row-message-3">
              <p class="p">Estagiario has sent you a friend request</p>
              <div class="table-row-message-4">22/06/2024 - 15H30</div>
            </div>
          </div>
          <div class="table-row-actions">
            <button class="button-5">
              <div class="button-icon-left"><img class="icon" src="img/image.svg" /></div>
              <div class="button-text-5">Accept request</div>
            </button>
            <button class="button-3">
              <div class="button-icon-left"><img class="icon" src="img/icon-5.svg" /></div>
              <div class="button-text-3">Decline request</div>
            </button>
          </div>
        </div>
      </div>
    </div>
    `;

    container.appendChild(style);
    return container;
}
