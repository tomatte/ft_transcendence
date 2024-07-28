const GameResultVictory = (player_left, player_right, description) => {
    const html = /* html */ `
    <div class="Game-result-semifinal">
    <div class="game-result__content">
        <div class="game-result__content__info">
            <div class="game-result__content__info__text">
                <h1 class="game-result__content__info__text__result-semifinal">VICTORY</h1>
                <h5 class="game-result__content__info__text__status-semifinal">${description}</h5>
                
            </div>
            <div class="game-result__content__info__brackets">

                <div class="player-bracket">
                    <img class="player-bracket__info__image" src="${player_left.avatar}" alt="Player Image"/>
                    <div class="player-bracket__info__text">
                        <span class="player-bracket__info__text__name font-body-medium-bold">${player_left.username}</span>
                        <span class="player-bracket__info__text__nickname font-body-regular">${player_left.nickname}</span>
                    </div>
                </div> 

                <div class="game-result__content__info__brackets__score">
                    <h1 class="game-result__content__info__brackets__score__data">${player_left.points}</h1>
                    <h1 class="game-result__content__info__brackets__score__data">X</h1>
                    <h1 class="game-result__content__info__brackets__score__data">${player_left.points}</h1>

                </div>

                <div class="player-bracket">
                    <img class="player-bracket__info__image" src="${player_right.avatar}" alt="Player Image"/>
                    <div class="player-bracket__info__text">
                        <span class="player-bracket__info__text__name font-body-medium-bold">${player_right.username}</span>
                        <span class="player-bracket__info__text__nickname font-body-regular">${player_right.nickname}</span>
                    </div>
                </div>
            </div>

        </div>
        
        <h6 class="game-result__content__info__redirect">You will be redirected to the brackets in 10 seconds...</h6>
    </div>
    <div class="game-result__footer">
 
            <img class="logo_result" src="/assets/logo/combination-mark_white.svg" alt="logo logomark">
 
    </div>

 </div>
    `
    return html
}

export default GameResultVictory