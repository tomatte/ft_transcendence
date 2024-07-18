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

function listenButtonClick(parent, btnId) {
    parent.addEventListener('click', function(event) {
        let targetElement = event.target;
        while (targetElement != null && targetElement !== this) {
            if (targetElement.id === btnId) {
                console.log(`${btnId} clicked`);
                break;
            }
            targetElement = targetElement.parentNode;
        }
    });
}

function createRow(profile_img, sender_username, date, time, type) {
    const info = infoTypes[type]
    const pageContentContainer = document.querySelector('.page-content__container');

    const btnRefuseId = `button-request-refuse-${type}-${sender_username}`
    const btnAcceptId = `button-request-accept-${type}-${sender_username}`

    listenButtonClick(pageContentContainer, btnAcceptId)
    listenButtonClick(pageContentContainer, btnRefuseId)
    
    return `<tr class="table-row">
            <td class="table-row__message">
                <img class="table-row__message__image" src="${profile_img}" alt="player">
                <div class="table-row__message__text">
                    <span class="table-row__message__text__content font-body-medium">${sender_username} ${info.message}</span>
                    <span class="table-row__message__text__timestamp font-body-regular">${date} - ${time}</span>
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
        rows += createRow(
            data.owner.avatar,
            data.owner.username,
            '17/07/2024',
            '17:24',
            'tournament'
        )
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