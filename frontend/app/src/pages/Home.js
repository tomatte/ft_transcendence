import { playRandomly } from "../scripts/websockets/websocketActions.js";
import { listenButtonClick } from "../scripts/element-creators/utils.js";
import { playLocal } from "../scripts/websockets/websocketActions.js";

listenButtonClick(
    document.querySelector('.page-content__container'),
    "button-play-random-match",
    () => playRandomly()
)

listenButtonClick(
    document.querySelector('.page-content__container'),
    "button-play-local-match",
    () => playLocal()
)


 
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
                    <button id="button-create-tournament" onclick="" class="button button--tertiary">
                        <span class="material-icons-round button__icon-left">add</span>
                        <span class="button__text font-body-regular-bold">Create</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../../assets/images/banners/tournament.png" alt="An illustration of a Trophy">
            </div>
        </div>

        <div class="game-mode-banner game-mode-banner--local-match">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">LOCAL MATCH</div>
                <div class="game-mode-banner__info__button">
                    <button id="button-play-local-match" class="button button--secondary">
                        <span class="material-icons-round button__icon-left">computer</span>
                        <span class="button__text font-body-regular-bold">Play locally</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/local-match.png" alt="An illustration of a medal">
            </div>
        </div>

        <div class="game-mode-banner game-mode-banner--friendly-match">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">FRIENDLY MATCH</div>
                <div class="game-mode-banner__info__button">
                    <button onclick="openModal('modalFriendlyMatch')" class="button button--success">
                        <span class="material-icons-round button__icon-left">sports_esports</span>
                        <span class="button__text font-body-regular-bold">Play with a friend</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/friendly-match.png" alt="An illustration of a hashtag">
            </div>
        </div>
 

        <div class="game-mode-banner game-mode-banner--random-match">
            <div class="game-mode-banner__info">
                <div class="game-mode-banner__info__title">RANDOM MATCH</div>
                <div class="game-mode-banner__info__button">
                    <button id="button-play-random-match" class="button button--primary">
                        <span class="material-icons-round button__icon-left">shuffle</span>
                        <span class="button__text font-body-regular-bold">Play randomly</span>
                    </button>
                </div>
            </div>
            <div class="game-mode-banner__illustration">
                <img class="game-mode-banner__illustration__image" src="../assets/images/banners/random-match.png" alt="An illustration of a medal">
            </div>
        </div>

        <div class="modal modal--invite-to-tournament" id="modalInviteToTournament">
                    <div class="modal__header">
                        <div class="modal__header__title">
                            <h4 class="modal__header__title__text">Invite to tournament</h4>
                            <button id="button-close-invite-tournament" class="button" onclick="openModal('modalDeleteTournament')">
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
                        <span id="tournament-status-ready" class="modal__player-queue__header__status__ready font-body-medium-bold"> </span>
                        <span class="material-icons-round modal__player-queue__header__status__icon icon--small">check_circle</span>
                    </div>
                </div>
                <div id="tournament-player-queue" class="modal__player-queue__list">

                </div>
            </div>

            <table class="modal__table">
                <thead class="modal__table__header">
                    <tr class="table-header">
                        <th class="table-header__text font-body-caption-bold">Player</th>
                        <th class="table-header__text font-body-caption-bold">Global ranking</th>
                        <th class="table-header__text text-align-action font-body-caption-bold text-align-action">Actions</th>
                    </tr>
                </thead>
                <tbody id="tournament_online_players" class="modal__table__body">
                    
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
                            <th class="table-header__text font-body-caption-bold">Player</th>
                            <th class="table-header__text font-body-caption-bold">Global ranking</th>
                            <th class="table-header__text font-body-caption-bold text-align-action">Actions</th>
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
            <div class="modal modal--remove-friend" id="modalDeleteTournament">
			<div class="modal__header">
				<div class="modal__header__title">
					<div class="modal__header__title__text">
						<h4>Delete tournament</h4>
					</div>
					<span class="material-icons-round modal__header__title__close icon--regular">close</span>
				</div>
				<span class="modal__header__description font-body-medium">
					If you leave this page, the tournament will be ended.
				</span>
			</div>
        <div class="modal__actions">
            <button class="button button--secondary" onclick="closeModal('modalDeleteTournament')">
                <span class="button__text font-body-regular-bold">No, stay</span>
            </button>
            <button class="button button--danger" onclick="closeBothModals()">
                <span class="button__text font-body-regular-bold">Yes, leave tournament</span>
            </button>
			</div>
		</div>

    
 <div id="modalOverlay" class="hidden"></div>


      `;

	  return pageContentContainer;
}

export default Home;