function createRow(profile_img, sender_name, date, time, type) {
    let accept_message
    if (type == "tournamenet") {
        accept_message = "Join Tournament"
    }
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
                    <span class="material-icons-round button__icon-left">${icon}</span>
                    <span class="button__text font-body-regular-bold">${accept_message}</span>
                </button>
                <button class="button button--outline">
                    <span class="material-icons-round button__icon-left">close</span>
                    <span class="button__text font-body-regular-bold">${refuse_message}</span>
                </button>
            </td>
        </tr>
    `
}

let profile_img = "../assets/images/players/caos.png"
createRow()