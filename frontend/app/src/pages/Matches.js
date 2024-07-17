// const Matches = (state) => {
//     console.log({state})
// 	const pageContentContainer = document.querySelector('.page-content__container');
  
  
//       pageContentContainer.innerHTML = `

//         <div class="page-content__container__header">
//           <div class="page-content__container__header__info">
//             <h4 class="page-content__container__header__info__title">Matches</h4>
//           </div>
//           <button class="button button--secondary">
//             <span class="material-icons-round button__icon-left">refresh</span>
//             <span class="button__text font-body-regular-bold">Refresh</span>
//           </button>
//         </div>
        
//         <div class="page-content__container__content page-content__container__content--matches">
//     	<table>
// 			<thead>
// 				<tr class="table-header">
// 					<th class="table-header__text font-body-caption-bold">Player</th>
// 					<th class="table-header__text font-body-caption-bold">Game type</th>
// 					<th class="table-header__text font-body-caption-bold">Score</th>
// 					<th class="table-header__text font-body-caption-bold">Status</th>
// 					<th class="table-header__text font-body-caption-bold">Date</th>
// 				</tr>
//             </thead>
// 			<tbody>
// 			    <tr class="table-row">
//                     <td class="table-row__player">
//                         <img class="table-row__player__image" src="../assets/images/players/caos.png" alt="player">
//                         <div class="table-row__player__text">
//                             <span class="table-row__player__text__name font-body-medium-bold">Caos Lourenc</span>
//                             <span class="table-row__player__text__nickname font-body-regular">clourenc</span>
//                         </div>
//                     </td>
//                     <td class="table-row__data-default font-body-medium-bold">Friendly Match</td>
//                     <td class="table-row__data-default font-body-medium-bold">2 X 1</td>
//                     <td class="table-row__tag">
//                         <span class="tag tag--defeat">
//                             <span class="tag__text font-body-regular-bold">Defeat</span>
//                         </span>
//                     </td>
//                     <td class="table-row__data-default font-body-medium-bold">30/06/2024</td>
//                 </tr>
// 				<tr class="table-row">
//                     <td class="table-row__player">
//                         <img class="table-row__player__image" src="../assets/images/players/caos.png" alt="player">
//                         <div class="table-row__player__text">
//                             <span class="table-row__player__text__name font-body-medium-bold">Caos Lourenc</span>
//                             <span class="table-row__player__text__nickname font-body-regular">clourenc</span>
//                         </div>
//                     </td>
//                     <td class="table-row__data-default font-body-medium-bold">Friendly Match</td>
//                     <td class="table-row__data-default font-body-medium-bold">2 X 1</td>
//                     <td class="table-row__tag">
//                         <span class="tag tag--defeat">
//                             <span class="tag__text font-body-regular-bold">Defeat</span>
//                         </span>
//                     </td>
//                     <td class="table-row__data-default font-body-medium-bold">30/06/2024</td>
//                 </tr>
// 			    <tr class="table-row">
//                     <td class="table-row__player">
//                         <img class="table-row__player__image" src="../assets/images/players/caos.png" alt="player">
//                         <div class="table-row__player__text">
//                             <span class="table-row__player__text__name font-body-medium-bold">Caos Lourenc</span>
//                             <span class="table-row__player__text__nickname font-body-regular">clourenc</span>
//                         </div>
//                     </td>
//                     <td class="table-row__data-default font-body-medium-bold">Friendly Match</td>
//                     <td class="table-row__data-default font-body-medium-bold">2 X 1</td>
//                     <td class="table-row__tag">
//                         <span class="tag tag--victory">
//                             <span class="tag__text font-body-regular-bold">Victory</span>
//                         </span>
//                     </td>
//                     <td class="table-row__data-default font-body-medium-bold">30/06/2024</td>
//                 </tr>
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
// };

// export default Matches;





 

let currentPage = 1;
const itemsPerPage = 4;

const Matches = (state) => {
    const pageContentContainer = document.querySelector('.page-content__container');

    const renderPagination = (totalMatches) => {
        const totalPages = Math.ceil(totalMatches / itemsPerPage);
        const paginationList = pageContentContainer.querySelector('.pagination__list');
        paginationList.innerHTML = '';

        paginationList.innerHTML += `
            <li class="pagination__control ${currentPage === 1 ? 'pagination__control--disabled' : ''}">
                <a href="#" data-page="1">First</a>
            </li>
            <li class="pagination__control ${currentPage === 1 ? 'pagination__control--disabled' : ''}">
                <a href="#" data-page="${currentPage - 1}">Previous</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationList.innerHTML += `
                <li class="pagination__item-number ${currentPage === i ? 'pagination__item-number--active' : ''}">
                    <a href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        paginationList.innerHTML += `
            <li class="pagination__control ${currentPage === totalPages ? 'pagination__control--disabled' : ''}">
                <a href="#" data-page="${currentPage + 1}">Next</a>
            </li>
            <li class="pagination__control ${currentPage === totalPages ? 'pagination__control--disabled' : ''}">
                <a href="#" data-page="${totalPages}">Last</a>
            </li>
        `;

        paginationList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                if (page > 0 && page <= totalPages) {
                    currentPage = page;
                    renderMatches(state);
                }
            });
        });
    };

    const renderMatches = (state) => {
        const matches = state.matches || []; // Assuming matches are passed in state
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const matchesToDisplay = matches.slice(start, end);

        const tb_info = matchesToDisplay.reduce((acc, match) => {
            return acc + `
                <tr class="table-row">
                    <td class="table-row__player">
                        <img class="table-row__player__image" src="${match.playerImage}" alt="player">
                        <div class="table-row__player__text">
                            <span class="table-row__player__text__name font-body-medium-bold">${match.playerName}</span>
                            <span class="table-row__player__text__nickname font-body-regular">${match.playerNickname}</span>
                        </div>
                    </td>
                    <td class="table-row__data-default font-body-medium-bold">${match.gameType}</td>
                    <td class="table-row__data-default font-body-medium-bold">${match.score}</td>
                    <td class="table-row__tag">
                        <span class="tag ${match.status === 'Victory' ? 'tag--victory' : 'tag--defeat'}">
                            <span class="tag__text font-body-regular-bold">${match.status}</span>
                        </span>
                    </td>
                    <td class="table-row__data-default font-body-medium-bold">${match.date}</td>
                </tr>
            `;
        }, '');

        pageContentContainer.innerHTML = `
            <div class="page-content__container__header">
                <div class="page-content__container__header__info">
                    <h4 class="page-content__container__header__info__title">Matches</h4>
                </div>
                <button class="button button--secondary">
                    <span class="material-icons-round button__icon-left">refresh</span>
                    <span class="button__text font-body-regular-bold">Refresh</span>
                </button>
            </div>
            <div class="page-content__container__content page-content__container__content--matches">
                <table>
                    <thead>
                        <tr class="table-header">
                            <th class="table-header__text font-body-caption-bold">Player</th>
                            <th class="table-header__text font-body-caption-bold">Game type</th>
                            <th class="table-header__text font-body-caption-bold">Score</th>
                            <th class="table-header__text font-body-caption-bold">Status</th>
                            <th class="table-header__text font-body-caption-bold">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tb_info}
                    </tbody>
                </table>
                <nav class="pagination font-body-regular-bold">
                    <ul class="pagination__list">
                        <!-- Pagination will be injected here -->
                        <li class="pagination__item-number pagination__item-number--active"><a href="#">1</a></li>
                    </ul>
                </nav>
            </div>
        `;

        renderPagination(matches.length);
    };

    renderMatches(state);

    return pageContentContainer;
};

export default Matches;
