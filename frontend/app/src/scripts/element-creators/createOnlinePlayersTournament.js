function createRow(player) {
    return /* html */ `
        <tr class="table-row">
            <td class="table-row__player">
                <img class="table-row__player__image" src="${player.avatar}" alt="player">
                <div class="table-row__player__text">
                    <span class="table-row__player__text__name font-body-medium-bold">${player.username}</span>
                    <span class="table-row__player__text__nickname font-body-regular">${player.nickname}</span>
                </div>
            </td>
            <td class="table-row__data-default font-body-medium-bold">#1</td>
            <td class="table-row__actions">
                <button id="button-tournament-invite-${player.username}" class="button button--secondary">
                    <span class="button__text font-body-regular-bold">Invite to tournament</span>
                </button>
            </td>
        </tr>
    `
}

export default function createOnlinePlayersTournamentRows(players) {
    if (players && players.length == 0) {
        return "";
    }

    let rows = ""

    for (let key in players) {
        const row = createRow(players[key])
        rows += row
    }
    return rows
}
