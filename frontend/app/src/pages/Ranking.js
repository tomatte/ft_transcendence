const Ranking = () => {
	const pageContentContainer = document.querySelector('.page-content__container');
  
	pageContentContainer.innerHTML = `
  		<div class="page-content__container__header">
				<div class="page-content__container__header__info">
					<h4 class="page-content__container__header__info__title">Ranking</h4>
			</div>
 

    `;

    return pageContentContainer;
  }
  
  export default Ranking;