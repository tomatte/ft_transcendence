import AddTableLines from './AddTableLines.js';
import AddPaginationTables from './AddPaginationTables.js';


const loadingPage = () => {
	document.querySelector('.page-content__container').innerHTML = `
		<div class="page-content__container__header">
			<div class="page-content__container__header__info">
				<h4 class="page-content__container__header__info__title">Ranking</h4>
			</div>
			<button class="button button--secondary">
				<span class="material-icons-round button__icon-left">refresh</span>
				<span class="button__text font-body-regular-bold">Refresh</span>
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

		<div id="div_to_modal_delete"></div>
		<div id="modalOverlay" class="hidden"></div>
	`;
};


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
				<td class="table-row__actions" onclick="fetchDeleteFriend('${item.username}')">
					<button class="game-row-option">
						<span class="material-icons-round game-row-option__icon">person_remove</span>
					</button>
				</td>
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
	let response = await fetch('https://localhost:443/api/users/get/ranking', { method: 'GET', credentials: 'include' })
	if (response.status !== 200) throw new Error('Error status is not 200' + response.method); else return await response.json()
}


const Ranking = async () => {
	rankingData['rank_list'] = await fetchApiRanking();
	loadingPage();
	AddTableLines(rankingData);
	AddPaginationTables(rankingData);
};




export default Ranking;
