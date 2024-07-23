import { joinTournament } from "../scripts/websockets/websocketActions.js"

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

function listenButtonClick(parent, btnId, callback) {
    parent.addEventListener('click', function(event) {
        let targetElement = event.target;
        while (targetElement != null && targetElement !== this) {
            if (targetElement.id === btnId) {
                console.log(`${btnId} clicked`);
                callback()
                break;
            }
            targetElement = targetElement.parentNode;
        }
    });
}

function createRow(data) {
    const info = infoTypes[data.type]
    const pageContentContainer = document.querySelector('.page-content__container');

    const btnRefuseId = `refuse-${data.tournament_id}`
    const btnAcceptId = `accept-${data.tournament_id}`

    listenButtonClick(
        pageContentContainer,
        btnAcceptId,
        () => joinTournament(data)
    )

    listenButtonClick(
        pageContentContainer,
        btnRefuseId,
        () => console.log(`refuse ${data.owner.username}'s tournament`)
    )
    
    return `<tr class="table-row">
            <td class="table-row__message">
                <img class="table-row__message__image" src="${data.owner.avatar}" alt="player">
                <div class="table-row__message__text">
                    <span class="table-row__message__text__content font-body-medium">${data.owner.username} ${info.message}</span>
                    <span class="table-row__message__text__timestamp font-body-regular">07/07 - 10:00</span>
                </div>
            </td>
            <td class="table-row__actions">
                <button id="${btnAcceptId}" class="button ${info.buttonStyle}">
                    <span class="material-icons-round button__icon-left">${info.icon}</span>
                    <span class="button__text font-body-regular-bold">${info.accept_message}</span>
                </button>
                <button id="${btnRefuseId}" class="button button--outline">
                    <span class="material-icons-round button__icon-left">close</span>
                    <span class="button__text font-body-regular-bold">${info.refuse_message}</span>
                </button>
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
          <button class="button button--secondary">
            <span class="material-icons-round button__icon-left">refresh</span>
            <span class="button__text font-body-regular-bold">Refresh</span>
          </button>
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