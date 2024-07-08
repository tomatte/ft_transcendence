async function fetch_friends() {
    const response = await fetch('http://127.0.0.1:8000/api/users/get/get-list-friends', {method: 'GET', credentials: 'include'});
    if (response.status != 200) throw new Error('Failed to fetch friends');
    return await response.json();
}


const Friends = async() => {
    const pageContentContainer = document.querySelector('.page-content__container');
    let friends = await fetch_friends();
    let tb_info = friends.reduce((acc, friend) => { return acc +  `
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
                            <span class="material-icons-round game-row-option__icon">sports_esports</span>
                        </button>
                        <button class="game-row-option">
                            <span class="material-icons-round game-row-option__icon">person_remove</span>
                        </button>
                    </td>
                </tr>
                `
    }, '');
    console.log(friends);
    pageContentContainer.innerHTML = `
        <div class="page-content__container__header">
            <div class="page-content__container__header__info">
                <h4 class="page-content__container__header__info__title">Friends</h4>
            </div>
            <button class="button button--success">
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
	    				<th class="table-header__text font-body-caption-regular">Player</th>
	    				<th class="table-header__text font-body-caption-regular">Global ranking</th>
	    				<th class="table-header__text font-body-caption-regular">Losses against you</th>
	    				<th class="table-header__text font-body-caption-regular">Wins against you</th>
	    				<th class="table-header__text font-body-caption-regular">Actions</th>
	    			</tr>
                </thead>
	    		<tbody>
                    ${tb_info}
	    		</tbody>
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

    return pageContentContainer;
  }

  export default Friends;
