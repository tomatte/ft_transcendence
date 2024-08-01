import AddTableLines from './AddTableLines.js';
import AddPaginationTables from './AddPaginationTables.js';


function getCookie(name) {
	const cookies = document.cookie.split(';');
	for(let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith(name + '=')) {
			return cookie.substring(name.length + 1);
		}
	}
	return null;
}


function get_status_match(is_winner) {
	const data = is_winner ? {tag: 'tag--victory', status: 'Victory'} : {tag: 'tag--defeat', status: 'Defeat'};
	const {tag, status} = data;

	return `
	  <span class="tag ${tag}">
		<span class="tag__text font-body-regular-bold">${status}</span>
	  </span>
	`;
}

const createTableLines = (matchesList) => {
	let username = getCookie('username');
	let nickname = getCookie('nickname');
	return matchesList.reduce((acc, item) => {return acc + `
		<tr class="table-row">
			<td class="table-row__player">
				<div class="table-row__player__image-container">
					<img class="table-row__player__image" src="${item.opponent_avatar}" alt="player">
				</div>
				<div class="table-row__player__text">
					<span class="table-row__player__text__name font-body-medium-bold">${item.opponent_username}</span>
					<span class="table-row__player__text__nickname font-body-regular">${item.opponent_nickname}</span>
				</div>
			</td>
			<td class="table-row__data-default font-body-medium-bold">${item.type}</td>
			<td class="table-row__data-default font-body-medium-bold">${item.my_score} X ${item.opponent_score}</td>
			<td class="table-row__tag">
			   ${get_status_match(item.winner)}
			</td>
			<td class="table-row__data-default font-body-medium-bold">${item.date}</td>
		</tr>`
	}, '')
}


var rankingData = {
	"rank_list": [],
	"currentPage": 1,
	"itemsPerPage": 4,
	"createLines": createTableLines,
}

async function fetchMatches() {
	let response = await fetch('/api/users/get/historic', { method: 'GET', credentials: 'include' })
	return response.json();
}


const Matches = async() => {
	rankingData['rank_list'] = await fetchMatches();
	loadingPage();
	AddTableLines(rankingData);
	AddPaginationTables(rankingData);
};


const loadingPage = () => {
	document.querySelector('.page-content__container').innerHTML =  `
		<div class="page-content__container__header">
			<div class="page-content__container__header__info">
				<h4 class="page-content__container__header__info__title">Matches</h4>
			</div>
			<button type="button" class="button button--secondary">
				<span class="material-icons-round button__icon-left">refresh</span>
				<span class="button__text font-body-regular-bold">Refresh</span>
			</button>
		</div>
		<div class="page-content__container__content page-content__container__content--matches">
			<table>
				<thead>
					<tr class="table-header">
						<th class="table-header__text font-body-caption-regular">Player</th>
						<th class="table-header__text font-body-caption-regular">Game type</th>
						<th class="table-header__text font-body-caption-regular">Score</th>
						<th class="table-header__text font-body-caption-regular">Status</th>
						<th class="table-header__text font-body-caption-regular">Date</th>
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
	`;
}


export default Matches;
