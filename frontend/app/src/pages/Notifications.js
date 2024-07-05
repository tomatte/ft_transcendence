const tournamentRequestInfo = {
    accept_message: "Join Tournament",
    refuse_message: "Decline invitation",
    icon: "emoji_events",
    buttonStyle: "button--tertiary",
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
                <button class="button ${info.buttonStyle}">
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

const mockData = [
    {
        img: "../assets/images/players/caos.png",
        'name': "Caos",
        'date': "05/07",
        'time': "08:46",
        'type': "friend"
    },
    {
        img: "../assets/images/players/caos.png",
        'name': "Caos",
        'date': "05/07",
        'time': "08:46",
        'type': "match"
    },
    {
        img: "../assets/images/players/caos.png",
        'name': "Caos",
        'date': "05/07",
        'time': "08:46",
        'type': "tournament"
    },
    {
        img: "../assets/images/players/caos.png",
        'name': "Caos",
        'date': "05/07",
        'time': "08:46",
        'type': "friend"
    }
]

function createRows(data) {
    let rows = ""
    data.forEach((info) => {
        rows += createRow(
            info.img,
            info.name,
            info.date,
            info.time,
            info.type
        )
    })
    return rows
}

const Notifications = (state) => {
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
                ${createRows(mockData)}
			</tbody>
          </table>
		 
        </div>
  `;

  return pageContentContainer;
}

export default Notifications;