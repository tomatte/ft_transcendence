const Notifications = () => {
	const pageContentContainer = document.querySelector('.page-content__container');
  
	pageContentContainer.innerHTML = `
<div class="page-content__container__header">
  <div class="page-content__container__header__info">
    <h4 class="page-content__container__header__info__title">Notifications</h4>
  </div>
  <button class="button button--secondary">
    <span class="material-icons-round button__icon-left">refresh</span>
    <span class="button__text font-body-regular-bold">Refresh</span>
  </button>
</div>

<table class="notifications-table">
  <tbody>
    <!-- NOTIFICATION FRIENDLY MATCH -->
    <tr class="table-row">
      <td class="table-row__message">
        <img class="table-row__message__image" src="../assets/images/players/caos.png" alt="player">
        <div class="table-row__message__text">
          <span class="table-row__message__text__content font-body-medium">Caos has challenged you to a friendly match</span>
          <span class="table-row__message__text__timestamp font-body-regular">22/06/2024 - 15H30</span>
        </div>
      </td>
      <td class="table-row__actions">
        <button class="button button--primary">
          <span class="material-icons-round button__icon-left">sports_esports</span>
          <span class="button__text font-body-regular-bold">Play match</span>
        </button>
        <button class="button button--outline">
          <span class="material-icons-round button__icon-left">close</span>
          <span class="button__text font-body-regular-bold">Decline match</span>
        </button>
      </td>
    </tr>

    <!-- NOTIFICATION TOURNAMENT -->
    <tr class="table-row">
      <td class="table-row__message">
        <img class="table-row__message__image" src="../assets/images/players/caos.png" alt="player">
        <div class="table-row__message__text">
          <span class="table-row__message__text__content font-body-medium">Caos has challenged you to a friendly match</span>
          <span class="table-row__message__text__timestamp font-body-regular">22/06/2024 - 15H30</span>
        </div>
      </td>
      <td class="table-row__actions">
        <button class="button button--tertiary">
          <span class="material-icons-round button__icon-left">emoji_events</span>
          <span class="button__text font-body-regular-bold">Play tournament</span>
        </button>
        <button class="button button--outline">
          <span class="material-icons-round button__icon-left">close</span>
          <span class="button__text font-body-regular-bold">Decline invitation</span>
        </button>
      </td>
    </tr>

    <!-- NOTIFICATION ADD FRIEND -->
    <tr class="table-row">
      <td class="table-row__message">
        <img class="table-row__message__image" src="../assets/images/players/caos.png" alt="player">
        <div class="table-row__message__text">
          <span class="table-row__message__text__content font-body-medium">Caos has challenged you to a friendly match</span>
          <span class="table-row__message__text__timestamp font-body-regular">22/06/2024 - 15H30</span>
        </div>
      </td>
      <td class="table-row__actions">
        <button class="button button--success">
          <span class="material-icons-round button__icon-left">person_add</span>
          <span class="button__text font-body-regular-bold">Accept request</span>
        </button>
        <button class="button button--outline">
          <span class="material-icons-round button__icon-left">close</span>
          <span class="button__text font-body-regular-bold">Decline request</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>

  `;

  return pageContentContainer;
}

export default Notifications;