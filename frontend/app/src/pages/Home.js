const Home = (state) => {
    console.log({state})
	const pageContentContainer = document.querySelector('.page-content__container');
  
        pageContentContainer.innerHTML = `
        <div class="page-content__container__header">
            <div class="page-content__container__header__info">
                <h4 class="page-content__container__header__info__title">Home</h4>
        </div>
        </div>

    
        <div class="game-mode-banner game-mode-banner--tournament">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">TOURNAMENT</div>
                <div class="game-mode-banner__info__button">
                    <button onclick="openModal('modalConfirmationDelete')" class="button button--tertiary">
                        <span class="material-icons-round button__icon-left">add</span>
                        <span class="button__text font-body-regular-bold">Create</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/trophy.png" alt="An illustration of a Trophy">
            </div>
        </div>

        <div class="game-mode-banner game-mode-banner--play-randomly">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">1V1 MATCH</div>
                <div class="game-mode-banner__info__button">
                    <button onclick="openModal('modalConfirmationDelete2')" class="button button--secondary">
                        <span class="material-icons-round button__icon-left">shuffle</span>
                        <span class="button__text font-body-regular-bold">Play randomly</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/medal.png" alt="An illustration of a medal">
            </div>
        </div>

        <div class="game-mode-banner game-mode-banner--friendly-match">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">FRIENDLY MATCH</div>
                <div class="game-mode-banner__info__button">
                    <button class="button button--primary">
                        <span class="material-icons-round button__icon-left">sports_esports</span>
                        <span class="button__text font-body-regular-bold">Play with a friend</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/flag.png" alt="An illustration of a flag">
            </div>
        </div>



        <div class="modal modal--confirmation-delete" id="modalConfirmationDelete">
            <div class="modal__header">
                <div class="modal__header__title">
                    <div class="modal__header__title__text">
                        <h4>Leave tournament</h4>
                    </div>
                    <button onclick="closeModal('modalConfirmationDelete')" class="button">
                        <span class="material-icons-round modal__header__title__close icon--regular">close</span>
                    </button>
                </div>
                <span class="modal__header__description font-body-medium">
                    Are you sure you want to leave this tournament? This action is irreversible and you will no longer be part of the tournament.
                </span>
            </div>
            <div class="modal__actions">
                <button class="button button--secondary">
                    <span class="button__text font-body-regular-bold">No, cancel</span>
                </button>
                <button class="button button--danger">
                    <span class="button__text font-body-regular-bold">Yes, leave tournament</span>
                </button>
            </div>
        </div>

        <div id="modalOverlay"></div>

    
      `;

	  return pageContentContainer;
}

export default Home;