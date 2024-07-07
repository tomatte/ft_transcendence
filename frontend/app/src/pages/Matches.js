const Matches = (state) => {
    console.log({state})
	const pageContentContainer = document.querySelector('.page-content__container');
  
  
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
					<th class="table-header__text font-body-caption-regular">Player</th>
					<th class="table-header__text font-body-caption-regular">Game type</th>
					<th class="table-header__text font-body-caption-regular">Score</th>
					<th class="table-header__text font-body-caption-regular">Status</th>
					<th class="table-header__text font-body-caption-regular">Date</th>
				</tr>
            </thead>
			<tbody>
			    <tr class="table-row">
                    <td class="table-row__player">
                        <img class="table-row__player__image" src="../assets/images/players/caos.png" alt="player">
                        <div class="table-row__player__text">
                            <span class="table-row__player__text__name font-body-medium-bold">Caos Lourenc</span>
                            <span class="table-row__player__text__nickname font-body-regular">clourenc</span>
                        </div>
                    </td>
                    <td class="table-row__data-default font-body-medium-bold">Friendly Match</td>
                    <td class="table-row__data-default font-body-medium-bold">2 X 1</td>
                    <td class="table-row__tag">
                        <span class="tag tag--defeat">
                            <span class="tag__text font-body-regular-bold">Defeat</span>
                        </span>
                    </td>
                    <td class="table-row__data-default font-body-medium-bold">30/06/2024</td>
                </tr>
				<tr class="table-row">
                    <td class="table-row__player">
                        <img class="table-row__player__image" src="../assets/images/players/caos.png" alt="player">
                        <div class="table-row__player__text">
                            <span class="table-row__player__text__name font-body-medium-bold">Caos Lourenc</span>
                            <span class="table-row__player__text__nickname font-body-regular">clourenc</span>
                        </div>
                    </td>
                    <td class="table-row__data-default font-body-medium-bold">Friendly Match</td>
                    <td class="table-row__data-default font-body-medium-bold">2 X 1</td>
                    <td class="table-row__tag">
                        <span class="tag tag--defeat">
                            <span class="tag__text font-body-regular-bold">Defeat</span>
                        </span>
                    </td>
                    <td class="table-row__data-default font-body-medium-bold">30/06/2024</td>
                </tr>
			    <tr class="table-row">
                    <td class="table-row__player">
                        <img class="table-row__player__image" src="../assets/images/players/caos.png" alt="player">
                        <div class="table-row__player__text">
                            <span class="table-row__player__text__name font-body-medium-bold">Caos Lourenc</span>
                            <span class="table-row__player__text__nickname font-body-regular">clourenc</span>
                        </div>
                    </td>
                    <td class="table-row__data-default font-body-medium-bold">Friendly Match</td>
                    <td class="table-row__data-default font-body-medium-bold">2 X 1</td>
                    <td class="table-row__tag">
                        <span class="tag tag--victory">
                            <span class="tag__text font-body-regular-bold">Victory</span>
                        </span>
                    </td>
                    <td class="table-row__data-default font-body-medium-bold">30/06/2024</td>
                </tr>
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
};

export default Matches;
