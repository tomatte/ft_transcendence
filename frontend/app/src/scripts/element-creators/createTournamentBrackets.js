

function createBracket(player) {
    return /* html */ `
        <div class="tournament-bracket">
            <div class="player-bracket">
                <img class="player-bracket__info__image" src="${player.avatar}" alt="Player Image"/>
                <div class="player-bracket__info__text">
                    <span class="player-bracket__info__text__name font-body-medium-bold">${player.username}</span>
                    <span class="player-bracket__info__text__nickname font-body-regular">${player.nickname}</span>
                </div>
            </div>
        </div>
        `
}

const emptyPlayer = {
    "avatar": "",
    "username": "???",
    "nickname": "?"
}

export default function createTournamentBrackets(players) {
    if (players && players.length == 0) {
        return "";
    }

    let leftBrackets = ""
    let rightBrackets = ""

    let index = 0
    for (const player of players) {
        if (index < 2) {
            leftBrackets += createBracket(player)
        } else {
            rightBrackets += createBracket(player)
        }
        index++
    }

    for (let len = players.length; len < 4; len++) {

        if (len < 2) {
            leftBrackets += createBracket(emptyPlayer)
        } else {
            rightBrackets += createBracket(emptyPlayer)
        }
    }

    return {leftBrackets, rightBrackets}
}
