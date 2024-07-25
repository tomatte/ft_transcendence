const goBackButton = /* html */ `
            <button class="button button--secondary">

                <span class="button__text font-body-regular-bold">Go back to Home</span>
                <span class="material-icons-round button__icon-right">arrow_forward</span>
            </button>
`

const createGameResult = (left, right, goBack = true) => {

    const winnerUsername = left.points > right.points ? left.username : right.username

    const html = /* html */ `
    <div class="game-result">
        <div class="game-result__content">
            <div class="game-result__content__info">
                    
                <h1 class="game-result__content__info__winner">Winner: ${winnerUsername}</h1>

                <div class="game-result__content__info__brackets">
                    
                    <div class="player-bracket">
                        <img class="player-bracket__info__image" src="${left.avatar}" alt="Player Image"/>
                        <div class="player-bracket__info__text">
                            <span class="player-bracket__info__text__name font-body-medium-bold">${left.username}</span>
                            <span class="player-bracket__info__text__nickname font-body-regular">${left.nickname}</span>
                        </div>
                    </div>
                
                    <div class="game-result__content__info__brackets__score">
                        <h1 class="game-result__content__info__brackets__score__data">${left.points}</h1>
                        <h1 class="game-result__content__info__brackets__score__data">X</h1>
                        <h1 class="game-result__content__info__brackets__score__data">${right.points}</h1>
                    </div>
                    
                    <div class="player-bracket">
                        <img class="player-bracket__info__image" src="${right.avatar}" alt="Player Image"/>
                        <div class="player-bracket__info__text">
                            <span class="player-bracket__info__text__name font-body-medium-bold">${right.username}</span>
                            <span class="player-bracket__info__text__nickname font-body-regular">${right.nickname}</span>
                        </div>
                    </div>
                </div>
            </div>
            ${goBack ? goBackButton : ""}
        </div>

        <div class="game-result__footer">
            <div class="Logo_otter">
                <img src="../assets/logo/combination-mark_white.svg" alt="Logo_otter">
            </div>
        </div>

    </div>
    `

    return html
}

export default createGameResult