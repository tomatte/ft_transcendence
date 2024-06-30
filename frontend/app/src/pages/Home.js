const Home = () => {
	const pageContentContainer = document.querySelector('.page-content__container');
  
        pageContentContainer.innerHTML = `
	<div class="page-content__container">
    <div class="page-content__container__header">
        <div class="page-content__container__header__info">
        <h4 class="page-content__container__header__info__title">Home</h4>
    </div>

    <div class="page-content__container__content">
        <div class="game-mode-banner game-mode-banner--tournament">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">TOURNAMENT</div>
                <div class="game-mode-banner__info__button">
                    <button class="button button--tertiary">
                        <span class="material-icons-round button__icon-left">add</span>
                        <span class="button__text font-body-regular-bold">Create</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/trophy.png" alt="">
            </div>
        </div>

        <div class="game-mode-banner game-mode-banner--play-randomly">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">1V1 MATCH</div>
                <div class="game-mode-banner__info__button">
                    <button class="button button--secondary">
                        <span class="material-icons-round button__icon-left">shuffle</span>
                        <span class="button__text font-body-regular-bold">Play randomly</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/medal.png" alt="">
            </div>
        </div>

        <div class="game-mode-banner game-mode-banner--friendly-match">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">1V1 MATCH</div>
                <div class="game-mode-banner__info__button">
                    <button class="button button--primary">
                        <span class="material-icons-round button__icon-left">sports_esports</span>
                        <span class="button__text font-body-regular-bold">Play with a friend</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/flag.png" alt="">
            </div>
        </div>



    </div>


</div>

    
      `;

	  return pageContentContainer;
}

export default Home;