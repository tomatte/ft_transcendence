import AddTableLines from './AddTableLines.js';
import AddPaginationTables from './AddPaginationTables.js';


const loadingPage = () => {
	document.querySelector('.page-content__container').innerHTML = `
		<div class="page-content__container__header">
			<div class="page-content__container__header__info">
				<h4 class="page-content__container__header__info__title">Ranking</h4>
			</div>
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
					<div class="table-row__player__image-container">
						<img class="table-row__player__image" src="${item.avatar}" alt="player">
					</div>
					<div class="table-row__player__text">
						<span class="table-row__player__text__name font-body-medium-bold">${truncStr(item.nickname)}</span>
						<span class="table-row__player__text__nickname font-body-regular">${truncStr(item.username)}</span>
					</div>
				</td>
				<td class="table-row__data-default font-body-medium-bold">${item.total_score}</td>
				<td class="table-row__data-default font-body-medium-bold">${item.wins}</td>
				<td class="table-row__data-default font-body-medium-bold">${item.losses}</td>
				<td class="table-row__data-default font-body-medium-bold">${item.win_rate}%</td>
				<td class="table-row__data-default font-body-medium-bold">${item.losses_rate}</td>
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
	loadingPage();
	AddTableLines(rankingData);
	AddPaginationTables(rankingData);
};




export default Ranking;
