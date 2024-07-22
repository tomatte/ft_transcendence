// async function fetch_friends() {
//     const response = await fetch('http://127.0.0.1:8000/api/users/get/get-list-friends', {method: 'GET', credentials: 'include'});
//     if (response.status != 200) throw new Error('Failed to fetch friends');
//     return await response.json();
// }


// const Friends = async() => {
//     const pageContentContainer = document.querySelector('.page-content__container');
//     let friends = await fetch_friends();
//     let tb_info = friends.reduce((acc, friend) => { return acc +  `
//         <tr class="table-row">
//                     <td class="table-row__player">
//                         <img class="table-row__player__image" src="${friend.avatar}" alt="player">
//                         <div class="table-row__player__text">
//                             <span class="table-row__player__text__name font-body-medium-bold">${friend.username}</span>
//                             <span class="table-row__player__text__nickname font-body-regular">${friend.nickname}</span>
//                         </div>
//                     </td>
//                     <td class="table-row__data-default font-body-medium-bold">${friend.global_ranking}</td>
//                     <td class="table-row__data-default font-body-medium-bold">${friend.losses_against_you}</td>
//                     <td class="table-row__data-default font-body-medium-bold">${friend.winners_against_you}</td>
//                     <td class="table-row__actions">
//                         <button class="game-row-option">
//                             <span class="material-icons-round game-row-option__icon">person_remove</span>
//                         </button>
//                     </td>
//                 </tr>
//                 `
//     }, '');
//     console.log(friends);
//     pageContentContainer.innerHTML = `
//         <div class="page-content__container__header">
//             <div class="page-content__container__header__info">
//                 <h4 class="page-content__container__header__info__title">Friends</h4>
//             </div>
//             <button onclick="openModal('modalAddFriend')" class="button button--success">
//                  <span class="button__text font-body-regular-bold">Add Friend</span>
//             </button>
//         </div>
//         <div class="page-content__container__header__search-bar">
//             <div class="search-bar">
//             <span class="material-icons-round search-bar__icon icon--regular">search</span>
//             <input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name...">
//         </div>
//         </div>
//             <div class="page-content__container__content page-content__container__content--matches">
//         	<table>
// 	    		<thead>
// 	    			<tr class="table-header">
// 	    				<th class="table-header__text font-body-caption-bold">Player</th>
// 	    				<th class="table-header__text font-body-caption-bold">Global ranking</th>
// 	    				<th class="table-header__text font-body-caption-bold">Losses against you</th>
// 	    				<th class="table-header__text font-body-caption-bold">Wins against you</th>
// 	    				<th class="table-header__text font-body-caption-bold">Actions</th>
// 	    			</tr>
//                 </thead>
// 	    		<tbody>
//                     ${tb_info}
// 	    		</tbody>
//             </table>
// 	    	<nav class="pagination font-body-regular-bold">
// 	    		<ul class="pagination__list">
// 	    		    <li class="pagination__control pagination__control--disabled">
// 	    		    	<a href="#">
// 	    		    	<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
// 	    		    	<span class="pagination__control__text">First</span>
// 	    		    	</a>
// 	    		    </li>
// 	    		    <li class="pagination__control pagination__control--disabled">
// 	    		    	<a href="#">
// 	    		    	<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_left</span>
// 	    		    	<span class="pagination__control__text">Previous</span>
// 	    		    	</a>
// 	    		    </li>
// 	    		    <li class="pagination__item-number pagination__item-number--active"><a href="#">1</a></li>
// 	    		    <li class="pagination__item-number"><a href="#">2</a></li>
// 	    		    <li class="pagination__item-number"><a href="#">3</a></li>
// 	    		    <li class="pagination__item-number"><a href="#">4</a></li>
// 	    		    <li class="pagination__item-number"><a href="#">5</a></li>
// 	    		    <li class="pagination__item-number">
// 	    		    	<a href="#">
// 	    		    	<span class="material-icons-round icon--small">more_horiz</span>
// 	    		    	</a>
// 	    		    </li>
// 	    		    <li class="pagination__item-number"><a href="#">25</a></li>
// 	    		    <li class="pagination__control">
// 	    		    	<a class="pagination__control__link" href="#">
// 	    		    	<span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_right</span>
// 	    		    	<span class="pagination__control__text">Next</span>
// 	    		    	</a>
// 	    		    </li>
// 	    		    <li class="pagination__control">
// 				    <a class="pagination__control__link" href="#">
// 				        <span class="material-icons-round pagination__control__icon-left icon--medium">keyboard_double_arrow_right</span>
// 				        <span class="pagination__control__text">Last</span>
// 				    </a>
// 			    </li>
// 			</ul>
//     	</nav>
//     </div>



//      <div class="modal modal--add-friend" id="modalAddFriend">

//             <div class="modal__header-add_friend">

//                 <div class="modal__header__title">
//                     <h4 class="modal__header__title__text">Add Friend</h4>
//                     <span onclick="closeModal('modalAddFriend')" class="material-icons-round modal__header__title__close icon--regular">close</span>
//                 </div>
//                 <div class="search-bar">
//                     <span class="material-icons-round search-bar__icon icon--regular">search</span>
//                     <input type="text" class="search-bar__input font-body-regular" placeholder="Search for a name...">
//                 </div>

             


// 			<table class="modal__table__header-add_friend"> 
 
//                     <thead class="modal__table__header">
//                         <tr class="table-header">
//                             <th class="table-header__text font-body-caption-bold">Player</th>
//                             <th class="table-header__text font-body-caption-bold">Global ranking</th>
//                             <th class="table-header__text font-body-caption-bold">Actions</th>
//                         </tr>
//                     </thead>


//                     <tbody class="modal__table__body">
//                         <tr class="table-row">
//                             <td class="table-row__player">
//                                 <img class="table-row__player__image" src="../../assets/images/players/estagiario.png" alt="player">
//                                 <div class="table-row__player__text">
//                                     <span class="table-row__player__text__name font-body-medium-bold">Luigi Encanador</span>
//                                     <span class="table-row__player__text__nickname font-body-regular">Luador</span>
//                                 </div>
//                             </td>
//                             <td class="table-row__data-default font-body-medium-bold">#132</td>
//                             <td class="table-row__actions">
//                                 <button class="button button--success">
//                                     <span class="button__text font-body-regular-bold">Add friend</span>
//                                 </button>
//                             </td>
//                         </tr>
//                         <tr class="table-row">
//                             <td class="table-row__player">
//                                 <img class="table-row__player__image" src="../../assets/images/players/wwag.png" alt="player">
//                                 <div class="table-row__player__text">
//                                     <span class="table-row__player__text__name font-body-medium-bold">Corsinha Amarelo</span>
//                                     <span class="table-row__player__text__nickname font-body-regular">CAmarel</span>
//                                 </div>
//                             </td>
//                             <td class="table-row__data-default font-body-medium-bold">#155</td>
//                             <td class="table-row__actions">
//                                 <button class="button button--success">
//                                     <span class="button__text font-body-regular-bold">Add friend</span>
//                                 </button>
//                             </td>
//                         </tr>
//                         <tr class="table-row">
//                             <td class="table-row__player">
//                                 <img class="table-row__player__image" src="../../assets/images/players/tomatte.png" alt="player">
//                                 <div class="table-row__player__text">
//                                     <span class="table-row__player__text__name font-body-medium-bold">Nega Drive</span>
//                                     <span class="table-row__player__text__nickname font-body-regular">NDriv</span>
//                                 </div>
//                             </td>
//                             <td class="table-row__data-default font-body-medium-bold">#133</td>
//                             <td class="table-row__actions">
//                                 <button class="button button--success">
//                                     <span class="button__text font-body-regular-bold">Add friend</span>
//                                 </button>
//                             </td>
//                         </tr>
//                     </tbody>
// 			</table>

//         </div>
//         </div>

//  <div id="modalOverlay" class="hidden"></div>
// `;

//     return pageContentContainer;
//   }

//   export default Friends;


 





let currentPage = 1;
const itemsPerPage = 4;

// Função para buscar os amigos da API
async function fetch_friends() {
    const response = await fetch('http://127.0.0.1:8000/api/users/get/get-list-friends', { method: 'GET', credentials: 'include' });
    if (response.status != 200) throw new Error('Failed to fetch friends');
    return await response.json();
}

// Função para renderizar a tabela de amigos
const renderTable = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentPageData = data.slice(start, end);

    let tableLines = currentPageData.reduce((acc, friend) => {
        return acc + `
            <tr class="table-row">
                <td class="table-row__player">
                    <img class="table-row__player__image" src="${friend.avatar}" alt="player">
                    <div class="table-row__player__text">
                        <span class="table-row__player__text__name font-body-medium-bold">${friend.username}</span>
                        <span class="table-row__player__text__nickname font-body-regular">${friend.nickname}</span>
                    </div>
                </td>
                <td class="table-row__data-default font-body-medium-bold">${friend.global_ranking}</td>
                <td class="table-row__data-default font-body-medium-bold">${friend.losses_against_you}</td>
                <td class="table-row__data-default font-body-medium-bold">${friend.winners_against_you}</td>
                <td class="table-row__actions">
                    <button class="game-row-option">
                        <span class="material-icons-round game-row-option__icon">person_remove</span>
                    </button>
                </td>
            </tr>
        `;
    }, '');

    const tableBody = document.querySelector('.page-content__container__content--matches tbody');
    tableBody.innerHTML = tableLines;

    renderPagination(data.length, page);
};

// Função para renderizar a paginação
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
                Friends();
            }
        });
    });
};

// Função principal para renderizar a página de amigos
const Friends = async () => {
    const friends = await fetch_friends();
    const pageContentContainer = document.querySelector('.page-content__container');

    pageContentContainer.innerHTML = `
        <div class="page-content__container__header">
            <div class="page-content__container__header__info">
                <h4 class="page-content__container__header__info__title">Friends</h4>
            </div>
            <button onclick="openModal('modalAddFriend')" class="button button--success">
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
                        <th class="table-header__text font-body-caption-bold text-align-action">Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <nav class="pagination font-body-regular-bold">
                <ul class="pagination__list"></ul>
            </nav>
        </div>
        <div class="modal modal--add-friend" id="modalAddFriend">
            <!-- Modal content here -->
        </div>
        <div id="modalOverlay" class="hidden"></div>
    `;

    renderTable(friends, currentPage);
};

export default Friends;
