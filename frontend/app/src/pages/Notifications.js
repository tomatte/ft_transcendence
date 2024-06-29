const Notifications = () => {
  const component = document.createElement('div');
  component.innerHTML = `
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

 `;
  return component;
};

export default Notifications;