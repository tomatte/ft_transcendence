function createPlayerBracket(player) {
    return /* html */ `
        <div class="player-bracket">
            <img class="player-bracket__info__image" src="${player.avatar}" alt="Player Image"/>
            <div class="player-bracket__info__text">
                <span class="player-bracket__info__text__name font-body-medium-bold">${player.nickname}</span>
                <span class="player-bracket__info__text__nickname font-body-regular">${player.username}</span>
            </div>
        </div>
    `
}

export default function createPlayerQueueTournament(players) {
    if (players && players.length === 0) {
        return "";
    }

    let rows = ""

    for (let key in players) {
        rows += createPlayerBracket(players[key])
    }

    for (let i = 4 - players.length; i > 0; i--) {
        rows += `
            <div class="player-bracket player-bracket--waiting">
                <span class="material-icons-round player-bracket__waiting-icon icon--small">schedule</span>
                <span class="player-bracket__waiting-text font-body-regular">Waiting for player...</span>
            </div>`
    }

    return rows
}
