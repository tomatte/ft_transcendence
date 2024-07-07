const tournamentRequestInfo = {
    accept_message: "Join Tournament",
    refuse_message: "Decline invitation",
    icon: "emoji_events",
}
const friendRequestInfo = {
    accept_message: "Accept request",
    refuse_message: "Decline request",
    icon: "person_add",
}

const matchRequestInfo = {
    accept_message: "Play match",
    refuse_message: "Decline match",
    icon: "sports_esports",
}

const infoTypes = {
    'tournament': tournamentRequestInfo,
    'friend': friendRequestInfo,
    'match': matchRequestInfo,
}

function createRow(profile_img, sender_name, date, time, type) {
    const info = infoTypes[type]
    
    return `<tr class="table-row">
            <td class="table-row__message">
                <img class="table-row__message__image" src="${profile_img}" alt="player">
                <div class="table-row__message__text">
                    <span class="table-row__message__text__content font-body-medium">${sender_name} has challenged you to a friendly match</span>
                    <span class="table-row__message__text__timestamp font-body-regular">${date} - ${time}</span>
                </div>
            </td>
            <td class="table-row__actions">
                <button class="button button--primary">
                    <span class="material-icons-round button__icon-left">${info.icon}</span>
                    <span class="button__text font-body-regular-bold">${info.accept_message}</span>
                </button>
                <button class="button button--outline">
                    <span class="material-icons-round button__icon-left">close</span>
                    <span class="button__text font-body-regular-bold">${info.refuse_message}</span>
                </button>
            </td>
        </tr>
    `
}
