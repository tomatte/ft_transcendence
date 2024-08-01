import AddTableLines from './AddTableLines.js';
import AddPaginationTables from './AddPaginationTables.js';
import { fetchFriends } from '../scripts/element-creators/utils.js';
import state from '../scripts/state/state.js';

const loadingPage = () => {
	document.querySelector('.page-content__container').innerHTML = `
		<div class="page-content__container__header">
			<div class="page-content__container__header__info">
				<h4 class="page-content__container__header__info__title">Friends</h4>
			</div>
			<button type="button" id="addFriendButton" class="button button--success" onclick="openModalToAdd()">
				 <span class="button__text font-body-regular-bold">Add Friend</span>
			</button>
		</div>
		<div class="page-content__container__header__search-bar">
			<div class="search-bar">
				<span class="material-icons-round search-bar__icon icon--regular">search</span>
				<input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name...">
			</div>
		</div>
		<div class="page-content__container__content page-content__container__content--matches">
			<table>
				<thead>
					<tr class="table-header">
						<th class="table-header__text font-body-caption-bold">Player</th>
						<th class="table-header__text font-body-caption-bold">Global ranking</th>
						<th class="table-header__text font-body-caption-bold">Losses against you</th>
						<th class="table-header__text font-body-caption-bold">Wins against you</th>
						<th class="table-header__text font-body-caption-bold table-row__actions">Actions</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
			<nav class="pagination font-body-regular-bold">
				<ul class="pagination__list">
					<li class="pagination__control pagination__control--disabled">
						<a href="#">
						<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
						<span class="pagination__control__text">First</span>
						</a>
					</li>
					<li class="pagination__control pagination__control--disabled">
						<a href="#">
						<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
						<span class="pagination__control__text">Previous</span>
						</a>
					</li>
					<li class="pagination__item-number pagination__item-number--active"><a href="#">1</a></li>
					<li class="pagination__item-number"><a href="#">2</a></li>
					<li class="pagination__item-number"><a href="#">3</a></li>
					<li class="pagination__item-number"><a href="#">4</a></li>
					<li class="pagination__item-number"><a href="#">5</a></li>
					<li class="pagination__item-number">
						<a href="#">
						<span class="material-icons-round icon--small">more_horiz</span>
						</a>
					</li>
					<li class="pagination__item-number"><a href="#">25</a></li>
					<li class="pagination__control">
						<a class="pagination__control__link" href="#">
						<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_right</span>
						<span class="pagination__control__text">Next</span>
						</a>
					</li>
					<li class="pagination__control">
						<a class="pagination__control__link" href="#">
							<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_right</span>
							<span class="pagination__control__text">Last</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
		<div class="modal modal--add-friend" id="modalAddFriend">
			<div class="modal__header-add_friend">
				<div class="modal__header__title">
					<h4 class="modal__header__title__text">Add Friend</h4>
					<span onclick="closeModal('modalAddFriend')" class="material-icons-round modal__header__title__close icon--regular">close</span>
				</div>
				<div class="search-bar">
					<span class="material-icons-round search-bar__icon icon--regular">search</span>
					<input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name..." id='search__add__friend' oninput="filterUsers()">
				</div>
				<table class="modal__table__header-add_friend">
					<thead class="modal__table__header">
						<tr class="table-header">
							<th class="table-header__text font-body-caption-bold">Player</th>
							<th class="table-header__text font-body-caption-bold">Global ranking</th>
							<th class="table-header__text font-body-caption-bold" style="text-align: end;">Actions</th>
						</tr>
					</thead>
					<tbody class="modal__table__body" id="body__modal__add__friend">
					</tbody>
				</table>
			</div>
		</div>
		<div id='div_to_modal_delete'></div>
	<div id="modalOverlay" class="hidden"></div>
	`
}

/* TODO: change str to green/red online status ball */
export const createTableLines = (friendList) => {
	return friendList.reduce((acc, friend) => {
		const onlineStatus = friend.online ? "ON" : "OFF"
		return acc + `
			<tr id="row-friend-${friend.username}" class="table-row">
				<td class="table-row__player">
					<img class="table-row__player__image" src="${friend.avatar}" alt="player">
					<div class="table-row__player__text">
						<span class="table-row__player__text__name font-body-medium-bold">${friend.username} ${onlineStatus}</span>
						<span class="table-row__player__text__nickname font-body-regular">${friend.nickname}</span>
					</div>
				</td>
				<td class="table-row__data-default font-body-medium-bold">${friend.global_ranking}</td>
				<td class="table-row__data-default font-body-medium-bold">${friend.losses_against_you}</td>
				<td class="table-row__data-default font-body-medium-bold">${friend.winners_against_you}</td>
				<td class="table-row__actions">
					<button type="button" class="game-row-option" onclick="fetchDeleteFriend('${friend.username}')">
						<span class="material-icons-round game-row-option__icon">person_remove</span>
					</button>
				</td>
			</tr>
		`
	}, '')
}


var rankingData = {
	"rank_list": [],
	"currentPage": 1,
	"itemsPerPage": 4,
	"createLines": createTableLines,
}


const Friends = async () => {
	rankingData['rank_list'] = state.friends;
	loadingPage();
	AddTableLines(rankingData);
	AddPaginationTables(rankingData);
};


export default Friends;
