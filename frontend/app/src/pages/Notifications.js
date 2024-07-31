import { joinTournament } from "../scripts/websockets/websocketActions.js"
import { listenButtonClick } from "../scripts/element-creators/utils.js"
import state from "../scripts/state/state.js"

const tournamentRequestInfo = {
    accept_message: "Join Tournament",
    refuse_message: "Decline invitation",
    icon: "emoji_events",
    buttonStyle: "button--tertiary",
    message: 'has invited you to a tournament'
}
const friendRequestInfo = {
    accept_message: "Accept request",
    refuse_message: "Decline request",
    icon: "person_add",
    buttonStyle: "button--success",
    message: 'wants to be your friend'
}

const matchRequestInfo = {
    accept_message: "Play match",
    refuse_message: "Decline match",
    icon: "sports_esports",
    buttonStyle: "button--primary",
    message: 'has challenged you to a friendly match',
}

const infoTypes = {
    'tournament': tournamentRequestInfo,
    'friend': friendRequestInfo,
    'match': matchRequestInfo,
}

function getBtnAcceptId(data) {
    if (data.type == 'tournament') {
        return `accept-${data.tournament_id}`
    }
    return `accept-friend-${data.owner.username}`
}

function getBtnRefuseId(data) {
    if (data.type == 'tournament') {
        return `refuse-${data.tournament_id}`
    }
    return `refuse-friend-${data.owner.username}`
}

function getTournamentButton(data, info) {
    const pageContentContainer = document.querySelector('.page-content__container');
    const btnRefuseId = getBtnRefuseId(data)
    const btnAcceptId = getBtnAcceptId(data)

    listenButtonClick(
        pageContentContainer,
        btnAcceptId,
        () => joinTournament(data)
    )

    return /* html */ `
        <button id="${btnAcceptId}" class="button ${info.buttonStyle}">
            <span class="material-icons-round button__icon-left">${info.icon}</span>
            <span class="button__text font-body-regular-bold">${info.accept_message}</span>
        </button>
    `
}

function removeStateFriendRequestNotification(username) {
    state.notifications = state.notifications.filter((notification) => {
        return (
            notification.owner.username != username ||
            notification.type != 'friend'
        )
    })
}

function getFriendRequestButtons(data, info) {
    const pageContentContainer = document.querySelector('.page-content__container');
    const btnRefuseId = getBtnRefuseId(data)
    const btnAcceptId = getBtnAcceptId(data)

    listenButtonClick(
        pageContentContainer,
        btnAcceptId,
        () => removeStateFriendRequestNotification(data.owner.username)
    )

    return /* html */ `
        <button id="${btnAcceptId}" class="button ${info.buttonStyle}" onclick="fetchAcceptFriendRequest('${data.owner.username}')">
            <span class="material-icons-round button__icon-left">${info.icon}</span>
            <span class="button__text font-body-regular-bold">${info.accept_message}</span>
        </button>
        <button id="${btnRefuseId}" class="button button--outline">
            <span class="material-icons-round button__icon-left">close</span>
            <span class="button__text font-body-regular-bold">${info.refuse_message}</span>
        </button>
    `
}

function getNotificationRowId(data) {
    if (data.type == 'tournament') {
        return `row-tournament-${data.tournament_id}`
    }
    return `row-friend-${data.owner.username}`
}

function createRow(data) {
    const info = infoTypes[data.type]
    const buttons = data.type == 'tournament' ? getTournamentButton(data, info) : getFriendRequestButtons(data, info)
    const rowId = getNotificationRowId(data)
    return `<tr id="${rowId}" class="table-row">
            <td class="table-row__message">
                <img class="table-row__message__image" src="${data.owner.avatar}" alt="player">
                <div class="table-row__message__text">
                    <span class="table-row__message__text__content font-body-medium">${data.owner.username} ${info.message}</span>
                    <span class="table-row__message__text__timestamp font-body-regular">07/07 - 10:00</span>
                </div>
            </td>
            <td class="table-row__actions">
                ${buttons}
            </td>
        </tr>
    `
}

function createRows(notifications) {

    let rows = ""
    notifications.forEach((data) => {
        rows += createRow(data)
    })
    return rows
}

const Notifications = (state) => {
    console.log(state)
    console.log(state.notifications)
	const pageContentContainer = document.querySelector('.page-content__container');
  
	pageContentContainer.innerHTML = `
        <div class="page-content__container__header">
          <div class="page-content__container__header__info">
            <h4 class="page-content__container__header__info__title">Notifications</h4>
          </div>
            <span></span>
        </div>
        
        <div class="page-content__container__content page-content__container__content--notification">
    	<table>
 
			<tbody>
                ${createRows(state['notifications'])}
			</tbody>
          </table>
		 
        </div>
  `;

  return pageContentContainer;
}

export default Notifications;