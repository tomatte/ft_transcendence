import renderTableLines from './RenderTableLines.js';


const createTableLines = (ranking_list, start) => {
	return ranking_list.reduce((acc, item, index) => {
		return acc + `
			<tr class="table-row">
				<td class="table-row__data-rank font-body-large">#${start + index + 1}</td>
				<td class="table-row__player">
					<img class="table-row__player__image" src="${item.avatar}">
					<div class="table-row__player__text">
						<span class="table-row__player__text__name font-body-medium-bold">${item.nickname}</span>
						<span class="table-row__player__text__nickname font-body-regular">${item.username}</span>
					</div>
				</td>
				<td class="table-row__data-default font-body-medium-bold">${item.global_ranking}</td>
				<td class="table-row__data-default font-body-medium-bold">${item.losses_against_you}</td>
				<td class="table-row__data-default font-body-medium-bold">${item.winners_against_you}</td>
				<td class="table-row__data-default font-body-medium-bold">${item.percent_winner}%</td>
				<td class="table-row__data-default font-body-medium-bold">${item.percent_losses}</td>
			</tr>
		`;
	}, '');
}


var rankingData = {
	"rank_list": [],
	"currentPage": 1,
	"itemsPerPage": 4,
	"createLines": createTableLines
}

async function fetchApiRanking() {
	let response = await fetch('/api/users/get/ranking', { method: 'GET', credentials: 'include' })
	if (response.status !== 200) throw new Error('Error status is not 200' + response.method); else return await response.json()
}


const Ranking = async () => {
	rankingData['rank_list'] = await fetchApiRanking();
	document.querySelector('.page-content__container').innerHTML = loadingBasePage();
	renderTableLines(rankingData);
};


const loadingBasePage = () => {
	return `
		<div class="page-content__container__header">
			<div class="page-content__container__header__info">
				<h4 class="page-content__container__header__info__title">Ranking</h4>
			</div>
			<button class="button button--secondary">
				<span class="material-icons-round button__icon-left">ios_share</span>
				<span class="button__text font-body-regular-bold">Share your ranking</span>
			</button>
		</div>
		<div class="search-bar">
			<span class="material-icons-round search-bar__icon icon--regular">search</span>
			<input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name...">
		</div>
		<div class="page-content__container__content page-content__container__content--ranking">
			<table>
				<thead>
					<tr class="table-header">
						<th class="table-header__text tableRankingPosition font-body-caption-bold">#</th>
						<th class="table-header__text font-body-caption-bold">PLAYER</th>
						<th class="table-header__text font-body-caption-bold">TOTAL SCORE</th>
						<th class="table-header__text font-body-caption-bold">WINS</th>
						<th class="table-header__text font-body-caption-bold">LOSSES</th>
						<th class="table-header__text font-body-caption-bold">WIN RATE</th>
						<th class="table-header__text font-body-caption-bold">LOSS RATE</th>
						<th class="table-header__text font-body-caption-bold table-actions-align-right">ACTIONS</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
			<nav class="pagination font-body-regular-bold">
				<ul class="pagination__list"></ul>
			</nav>
		</div>

		<div class="modal modal--remove-friend" id="modalRemoveFriend">
			<div class="modal__header">
				<div class="modal__header__title">
					<div class="modal__header__title__text">
						<h4>Remove friend</h4>
					</div>
					<span onclick="closeModal('modalRemoveFriend')" class="material-icons-round modal__header__title__close icon--regular">close</span>
				</div>
				<span class="modal__header__description font-body-medium">
					Are you sure you want to remove this player as a friend? You can always send another request to the player, whenever you want.
				</span>
			</div>
			<div class="modal__actions">
				<button type="button" onclick="closeModal('modalRemoveFriend')" class="button button--secondary">
					<span class="button__text font-body-regular-bold">No, cancel</span>
				</button>
				<button class="button button--danger">
					<span class="button__text font-body-regular-bold">Yes, remove friend</span>
				</button>
			</div>
		</div>

	<div id="modalOverlay" class="hidden"></div>
	`;
};


export default Ranking;
