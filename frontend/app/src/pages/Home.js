function createRow(player) {
    return /* html */ `
        <tr class="table-row">
            <td class="table-row__player">
                <img class="table-row__player__image" src="../../assets/images/players/tomatte.png" alt="player">
                <div class="table-row__player__text">
                    <span class="table-row__player__text__name font-body-medium-bold">player.username</span>
                    <span class="table-row__player__text__nickname font-body-regular">player.nickname</span>
                </div>
            </td>
            <td class="table-row__data-default font-body-medium-bold">#1</td>
            <td class="table-row__actions">
                <button class="button button--secondary">
                    <span class="button__text font-body-regular-bold">Invite to tournament</span>
                </button>
            </td>
        </tr>
    `
}

function createRows(players) {
    if (!Array.isArray(players) || players.length === 0) {
        return "";
    }

    let rows = ""
    players.forEach((player) => {
        rows += createRow(player)
    })

    for (let key in players) {
        rows += createRow(players[key])
    }
    return rows
}

const Home = (state) => {
    console.log({state})
	const pageContentContainer = document.querySelector('.page-content__container');
  
        pageContentContainer.innerHTML = /*html*/ `
        <div class="page-content__container__header">
            <div class="page-content__container__header__info">
                <h4 class="page-content__container__header__info__title">Home</h4>
        </div>
        </div>

    
        <div class="game-mode-banner game-mode-banner--tournament">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">TOURNAMENT</div>
                <div class="game-mode-banner__info__button">
                    <button onclick="openModal('modalInviteToTournament')" class="button button--tertiary">
                        <span class="material-icons-round button__icon-left">add</span>
                        <span class="button__text font-body-regular-bold">Create</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/trophy.png" alt="An illustration of a Trophy">
            </div>
        </div>

        <div class="game-mode-banner game-mode-banner--play-randomly">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">1V1 MATCH</div>
                <div class="game-mode-banner__info__button">
                    <button class="button button--secondary">
                        <span class="material-icons-round button__icon-left">shuffle</span>
                        <span class="button__text font-body-regular-bold">Play randomly</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/medal.png" alt="An illustration of a medal">
            </div>
        </div>

        <div class="game-mode-banner game-mode-banner--friendly-match">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">FRIENDLY MATCH</div>
                <div class="game-mode-banner__info__button">
                    <button onclick="openModal('modalFriendlyMatch')" class="button button--primary">
                        <span class="material-icons-round button__icon-left">sports_esports</span>
                        <span class="button__text font-body-regular-bold">Play with a friend</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/flag.png" alt="An illustration of a flag">
            </div>
        </div>

 
        <div class="modal modal--invite-to-tournament" id="modalInviteToTournament">
                    <div class="modal__header">
                        <div class="modal__header__title">
                            <h4 class="modal__header__title__text">Invite to tournament</h4>
                            <button onclick="closeModal('modalInviteToTournament')" class="button">
                                <span class="material-icons-round modal__header__title__close icon--regular">close</span>
                            </button>
                        </div>
                <div class="search-bar">
                    <span class="material-icons-round search-bar__icon icon--regular">search</span>
                    <input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name...">
                </div>
            </div>

            <div class="modal__player-queue">
                <div class="modal__player-queue__header">
                    <span class="modal__player-queue__header__title font-body-medium-bold">Players</span>
                    <div class="modal__player-queue__header__status">
                        <span class="modal__player-queue__header__status__ready font-body-medium-bold">3/4 ready</span>
                        <span class="material-icons-round modal__player-queue__header__status__icon icon--small">check_circle</span>
                    </div>
                </div>
                <div class="modal__player-queue__list">
                    <div class="player-bracket">
                        <img class="player-bracket__info__image" src="../../assets/images/players/tomatte.png" alt="Player Image"/>
                        <div class="player-bracket__info__text">
                            <span class="player-bracket__info__text__name font-body-medium-bold">Tomatte</span>
                            <span class="player-bracket__info__text__nickname font-body-regular">dbrandao</span>
                        </div>
                    </div>
                    <div class="player-bracket">
                        <img class="player-bracket__info__image" src="../../assets/images/players/tomatte.png" alt="Player Image"/>
                        <div class="player-bracket__info__text">
                            <span class="player-bracket__info__text__name font-body-medium-bold">Tomatte</span>
                            <span class="player-bracket__info__text__nickname font-body-regular">dbrandao</span>
                        </div>
                    </div>
                    <div class="player-bracket">
                        <img class="player-bracket__info__image" src="../../assets/images/players/tomatte.png" alt="Player Image"/>
                        <div class="player-bracket__info__text">
                            <span class="player-bracket__info__text__name font-body-medium-bold">Tomatte</span>
                            <span class="player-bracket__info__text__nickname font-body-regular">dbrandao</span>
                        </div>
                    </div>
                    <div class="player-bracket player-bracket--waiting">
                        <span class="material-icons-round player-bracket__waiting-icon icon--small">schedule</span>
                        <span class="player-bracket__waiting-text font-body-regular">Waiting for player...</span>
                    </div>
                </div>
            </div>

            <table class="modal__table">
                <thead class="modal__table__header">
                    <tr class="table-header">
                        <th class="table-header__text font-body-caption-regular">Player</th>
                        <th class="table-header__text font-body-caption-regular">Global ranking</th>
                        <th class="table-header__text font-body-caption-regular">Actions</th>
                    </tr>
                </thead>
                <tbody class="modal__table__body">
                    ${createRows(state.online_players)}
                </tbody>
            </table>
        </div>
 
 


<div class="modal modal--invite-to-tournament" id="modalFriendlyMatch">
                    <div class="modal__header">
                        <div class="modal__header__title">
                            <h4 class="modal__header__title__text">Friendly Match</h4>
                            <button onclick="closeModal('modalFriendlyMatch')" class="button">
                                <span class="material-icons-round modal__header__title__close icon--regular">close</span>
                            </button>
                        </div>

                <div class="search-bar">
                    <span class="material-icons-round search-bar__icon icon--regular">search</span>
                    <input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name...">
                </div>

           <table class="modal__table__header-add_friend"> 
 
                    <thead class="modal__table__header">
                        <tr class="table-header">
                            <th class="table-header__text font-body-caption-regular">Player</th>
                            <th class="table-header__text font-body-caption-regular">Global ranking</th>
                            <th class="table-header__text font-body-caption-regular">Actions</th>
                        </tr>
                    </thead>


                    <tbody class="modal__table__body">
                        <tr class="table-row">
                            <td class="table-row__player">
                                <img class="table-row__player__image" src="../../assets/images/players/estagiario.png" alt="player">
                                <div class="table-row__player__text">
                                    <span class="table-row__player__text__name font-body-medium-bold">Luigi Encanador</span>
                                    <span class="table-row__player__text__nickname font-body-regular">Luador</span>
                                </div>
                            </td>
                            <td class="table-row__data-default font-body-medium-bold">#132</td>
                            <td class="table-row__actions-friendly">
                                <button class="button button--success">
                                    <span class="button__text font-body-regular-bold"> Send invite</span>
                                </button>
                            </td>
                        </tr>
                        <tr class="table-row">
                            <td class="table-row__player">
                                <img class="table-row__player__image" src="../../assets/images/players/wwag.png" alt="player">
                                <div class="table-row__player__text">
                                    <span class="table-row__player__text__name font-body-medium-bold">Corsinha Amarelo</span>
                                    <span class="table-row__player__text__nickname font-body-regular">CAmarel</span>
                                </div>
                            </td>
                            <td class="table-row__data-default font-body-medium-bold">#155</td>
                            <td class="table-row__actions-friendly">
                                <button class="button button--success">
                                    <span class="button__text font-body-regular-bold"> Send invite</span>
                                </button>
                            </td>
                        </tr>
                        <tr class="table-row">
                            <td class="table-row__player">
                                <img class="table-row__player__image" src="../../assets/images/players/tomatte.png" alt="player">
                                <div class="table-row__player__text">
                                    <span class="table-row__player__text__name font-body-medium-bold">Nega Drive</span>
                                    <span class="table-row__player__text__nickname font-body-regular">NDriv</span>
                                </div>
                            </td>
                            <td class="table-row__data-default font-body-medium-bold">#133</td>
                            <td class="table-row__actions-friendly">
                                <button class="button button--success">
                                    <span class="button__text font-body-regular-bold"> Send invite </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
			</table>
        </div>
    </div>
    
 <div id="modalOverlay" class="hidden"></div>


      `;

	  return pageContentContainer;
}

export default Home;