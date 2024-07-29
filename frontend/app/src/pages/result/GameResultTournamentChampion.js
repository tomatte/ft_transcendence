const GameResultTournamentChampion = (player) => {
    const html = /* html */ `
    <div class="Game-result-body">

    <div class="tournament-result">
        <div class="tournament-result__info">
            <div class="tournament-result__info__text">
                <div class="tournament-result__info__text__display">
                    <h1 class="tournament-result__info__text__title">Congratulations!</h1>
                     <h6 class="tournament-result__info__text__description">You've conquered Otter Space - time to celebrate!</h6>
                </div>
                <div class="tournament-result__info__text__player">
                    <img class="imageplayer-tournament" src="${player.avatar}" alt="players">
                    <div class="player-info">
                        <span class="name_player_tournament">${player.username}</span>
                        <span class="nick_player_tournament">${player.nickname}</span>
                    </div>
                </div>
            </div>

            <div class="tournament-result__info__buttons">
                <button id="button-go-back-home" class="button button--secondary">
                    <span class="button__text font-body-regular-bold">Go back to home</span>
                    <span class="material-icons-round button__icon-right">arrow_forward</span>
                </button>
            </div>


        </div>


        <div class="tournament-result__image">
            <img class="trophyImage" src="../assets/images/tournament/tournament-result__image-right.png" alt="trophy">
        </div>
        
    </div>



 </div>
    `
    return html
}

export default GameResultTournamentChampion