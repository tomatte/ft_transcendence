function createPlayerBracket(player) {
    return /* html */ `
        <div class="player-bracket">
            <img class="player-bracket__info__image" src="${player.avatar}" alt="Player Image"/>
            <div class="player-bracket__info__text">
                <span class="player-bracket__info__text__name font-body-medium-bold">player.username</span>
                <span class="player-bracket__info__text__nickname font-body-regular">player.nickname</span>
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
        rows += createRow(players[key])
    }
    return rows
}
