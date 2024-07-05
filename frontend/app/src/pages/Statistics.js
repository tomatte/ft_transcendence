const Statistics = (state) => {
    console.log({ranking: state})
	
	const pageContentContainer = document.querySelector('.page-content__container');
  
	pageContentContainer.innerHTML = `
  			<div class="page-content__container__header">
				<div class="page-content__container__header__info">
					<h4 class="page-content__container__header__info__title">Statistics</h4>
				</div>
				<button class="button button--secondary">
					<span class="material-icons-round button__icon-left">refresh</span>
					<span class="button__text font-body-regular-bold">Refresh</span>
				</button>
			</div>
			<div class="page-content__container__content">
				<div class="page-content__container__content__card-metrics">
					<div class="metric-card">
						<span class="material-icons-round metric-card__icon icon--extra-large">sports_esports</span>
						<div class="metric-card__info">
							<span class="metric-card__info__label font-body-medium">Played Games</span>
							<span class="metric-card__info__data font-body-extra-large">48</span>
						</div>
					</div>
					<div class="metric-card">
						<span class="material-icons-round metric-card__icon icon--extra-large">emoji_events</span>
						<div class="metric-card__info">
							<span class="metric-card__info__label font-body-medium">Total Victories</span>
							<span class="metric-card__info__data font-body-extra-large">28</span>
						</div>
					</div>
					<div class="metric-card">
						<span class="material-icons-round metric-card__icon icon--extra-large">show_chart</span>
						<div class="metric-card__info">
							<span class="metric-card__info__label font-body-medium">Max. Consecutive Wins</span>
							<span class="metric-card__info__data font-body-extra-large">5</span>
						</div>
					</div>
					<div class="metric-card">
						<span class="material-icons-round metric-card__icon icon--extra-large">flare</span>
						<div class="metric-card__info">
							<span class="metric-card__info__label font-body-medium">Total Points</span>
							<span class="metric-card__info__data font-body-extra-large">240</span>
						</div>
					</div>
				</div>
				<div class="page-content__container__content__line-metrics">
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Losses</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">20</span>
					</div>
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Total Win Rate</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">64%</span>
					</div>
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Total Lost Rate</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">36%</span>
					</div>
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Average Points per Match</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">3</span>
					</div>
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Average Points Taken per Match</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">2</span>
					</div>
				</div>
			</div>
  `;

  return pageContentContainer;
}

export default Statistics;