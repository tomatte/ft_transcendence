export default () => {
    const container = document.createElement("div");
    container.classList.add("playground-container");

    const style = document.createElement("style");
    style.innerHTML = `
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap');
        @import url('../css/Components.css');
        @import url('../css/Colors.css');
        @import url('../css/Typography.css');
        @import url('playground.css');
    `;

    container.innerHTML = `
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
                <img class="game-mode-banner__illustration__image" src="../assets/trophy-dynamic-premium.png" alt="">
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
                <img class="game-mode-banner__illustration__image" src="../assets/medal-dynamic-premium.png" alt="">
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
                <img class="game-mode-banner__illustration__image" src="../assets/flag-dynamic-color.png" alt="">
            </div>
        </div>
    `;

    container.appendChild(style);
    return container;
}