// async function fetch_api_ranking() {
//     let response = await fetch('http://127.0.0.1:8000/api/users/get/ranking', { method: 'GET', credentials: 'include' })
//     if (response.status !== 200) throw new Error('Error status is not 200' + response.method); else return await response.json()
// }

// const Ranking = async () => {
//     let raking_data = await fetch_api_ranking()
//     let table_lines = raking_data.reduce((acc, item) => {return acc + `
//         <tr class="table-row">
//           <td class="table-row__data-rank font-body-large">#1</td>
//           <td class="table-row__player">
//               <img class="table-row__player__image" src="${item.avatar}">
//               <div class="table-row__player__text">
//                   <span class="table-row__player__text__name font-body-medium-bold">${item.nickname}</span>
//                   <span class="table-row__player__text__nickname font-body-regular">${item.username}</span>
//               </div>
//           </td>
//           <td class="table-row__data-default font-body-medium-bold">${item.global_ranking}</td>
//           <td class="table-row__data-default font-body-medium-bold">${item.losses_against_you}</td>
//           <td class="table-row__data-default font-body-medium-bold">${item.winners_against_you}</td>
//           <td class="table-row__data-default font-body-medium-bold">${item.percent_winner}%</td>
//           <td class="table-row__data-default font-body-medium-bold">${item.percent_losses}</td>
//           <td class="table-row__actions">
//               <button class="game-row-option">
//                   <span class="material-icons-round game-row-option__icon">sports_esports</span>
//               </button>
//               <button class="game-row-option">
//                   <span class="material-icons-round game-row-option__icon">person_remove</span>
//               </button>
//           </td>
//         </tr>
//     `},'')

//     const pageContentContainer = document.querySelector('.page-content__container');
//     pageContentContainer.innerHTML = `
//     <div class="page-content__container__header">
// 		<div class="page-content__container__header__info">
// 			<h4 class="page-content__container__header__info__title">Ranking</h4>
// 		</div>
// 		<button class="button button--secondary">
// 			<span class="material-icons-round button__icon-left">ios_share</span>
// 			<span class="button__text font-body-regular-bold">Share your ranking</span>
// 		</button>
//     </div>
//     <div class="search-bar">
//       <span class="material-icons-round search-bar__icon icon--regular">search</span>
//       <input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name...">
//     </div>
//         <div class="page-content__container__content page-content__container__content--ranking">
//     	<table>
// 			<thead>
// 				<tr class="table-header">
// 					<th class="table-header__text tableRankingPosition font-body-caption-regular">#</th>
// 					<th class="table-header__text font-body-caption-regular">PLAYER</th>
// 					<th class="table-header__text font-body-caption-regular">TOTAL SCORE</th>
// 					<th class="table-header__text font-body-caption-regular">WINS</th>
// 					<th class="table-header__text font-body-caption-regular">LOSSES</th>
// 					<th class="table-header__text font-body-caption-regular">WIN RATE</th>
// 					<th class="table-header__text font-body-caption-regular">LOSS RATE</th>
// 					<th class="table-header__text font-body-caption-regular">ACTIONS</th>
// 				</tr>
//             </thead>
// 			<tbody>

//                 ${table_lines}
      
// 			</tbody>
//           </table>
// 		<nav class="pagination font-body-regular-bold">
// 			<ul class="pagination__list">
// 			<li class="pagination__control pagination__control--disabled">
// 				<a href="#">
// 				<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
// 				<span class="pagination__control__text">First</span>
// 				</a>
// 			</li>
// 			<li class="pagination__control pagination__control--disabled">
// 				<a href="#">
// 				<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
// 				<span class="pagination__control__text">Previous</span>
// 				</a>
// 			</li>
// 			<li class="pagination__item-number pagination__item-number--active"><a href="#">1</a></li>
// 			<li class="pagination__item-number"><a href="#">2</a></li>
// 			<li class="pagination__item-number"><a href="#">3</a></li>
// 			<li class="pagination__item-number"><a href="#">4</a></li>
// 			<li class="pagination__item-number"><a href="#">5</a></li>
// 			<li class="pagination__item-number">
// 				<a href="#">
// 				<span class="material-icons-round icon--small">more_horiz</span>
// 				</a>
// 			</li>
// 			<li class="pagination__item-number"><a href="#">25</a></li>
// 			<li class="pagination__control">
// 				<a class="pagination__control__link" href="#">
// 				<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_right</span>
// 				<span class="pagination__control__text">Next</span>
// 				</a>
// 			</li>
// 			<li class="pagination__control">
// 				<a class="pagination__control__link" href="#">
// 				<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_right</span>
// 				<span class="pagination__control__text">Last</span>
// 				</a>
// 			</li>
// 			</ul>
//     	</nav>
//         </div>
//     `;

//     return pageContentContainer;
// }

// export default Ranking;



let currentPage = 1;
const itemsPerPage = 4;

async function fetch_api_ranking() {
    let response = await fetch('https://localhost:443/api/users/get/ranking', { method: 'GET', credentials: 'include' })
    if (response.status !== 200) throw new Error('Error status is not 200' + response.method); else return await response.json()
}

const renderTable = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentPageData = data.slice(start, end);

    let tableLines = currentPageData.reduce((acc, item, index) => {
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
                <td class="table-row__actions">
                    <button class="game-row-option">
                        <span class="material-icons-round game-row-option__icon">sports_esports</span>
                    </button>
                    <button class="game-row-option">
                        <span class="material-icons-round game-row-option__icon">person_remove</span>
                    </button>
                </td>
            </tr>
        `;
    }, '');

    const tableBody = document.querySelector('.page-content__container__content--ranking tbody');
    tableBody.innerHTML = tableLines;

    renderPagination(data.length, page);
};

const renderPagination = (totalItems, currentPage) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHtml = '';

    paginationHtml += `
        <li class="pagination__control ${currentPage === 1 ? 'pagination__control--disabled' : ''}">
            <a href="#" data-page="1">
                <span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
                <span class="pagination__control__text">First</span>
            </a>
        </li>
        <li class="pagination__control ${currentPage === 1 ? 'pagination__control--disabled' : ''}">
            <a href="#" data-page="${currentPage - 1}">
                <span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_arrow_left</span>
                <span class="pagination__control__text">Previous</span>
            </a>
        </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `
            <li class="pagination__item-number ${currentPage === i ? 'pagination__item-number--active' : ''}">
                <a href="#" data-page="${i}">${i}</a>
            </li>`;
    }

    paginationHtml += `
        <li class="pagination__control ${currentPage === totalPages ? 'pagination__control--disabled' : ''}">
            <a href="#" data-page="${currentPage + 1}">
                <span class="material-icons-round pagination__control__icon-right icon--medium">keyboard_arrow_right</span>
                <span class="pagination__control__text">Next</span>
            </a>
        </li>
        <li class="pagination__control ${currentPage === totalPages ? 'pagination__control--disabled' : ''}">
            <a href="#" data-page="${totalPages}">
                <span class="material-icons-round pagination__control__icon-right icon--medium">keyboard_double_arrow_right</span>
                <span class="pagination__control__text">Last</span>
            </a>
        </li>`;

    const paginationContainer = document.querySelector('.pagination__list');
    paginationContainer.innerHTML = paginationHtml;

    document.querySelectorAll('.pagination__control a, .pagination__item-number a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = parseInt(event.target.getAttribute('data-page'), 10);
            if (!isNaN(page)) {
                currentPage = page;
                renderTable(globalData, currentPage);
            }
        });
    });
};

let globalData = [];

const Ranking = async () => {
    globalData = await fetch_api_ranking();

    const pageContentContainer = document.querySelector('.page-content__container');
    pageContentContainer.innerHTML = `
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
                        <th class="table-header__text tableRankingPosition font-body-caption-regular">#</th>
                        <th class="table-header__text font-body-caption-regular">PLAYER</th>
                        <th class="table-header__text font-body-caption-regular">TOTAL SCORE</th>
                        <th class="table-header__text font-body-caption-regular">WINS</th>
                        <th class="table-header__text font-body-caption-regular">LOSSES</th>
                        <th class="table-header__text font-body-caption-regular">WIN RATE</th>
                        <th class="table-header__text font-body-caption-regular">LOSS RATE</th>
                        <th class="table-header__text font-body-caption-regular">ACTIONS</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <nav class="pagination font-body-regular-bold">
                <ul class="pagination__list"></ul>
            </nav>
        </div>
    `;

    renderTable(globalData, currentPage);
};

export default Ranking;
