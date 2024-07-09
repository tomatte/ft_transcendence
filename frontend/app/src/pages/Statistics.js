async function fetchStatistics() {
	const response = await fetch('http://127.0.0.1:8000/api/users/get/statistics/', { method: 'GET', credentials: 'include'});
	if (response.status !== 200) throw new Error('Error status is '+ response.status); else return await response.json();
}

function get_winRate(winners, all_matchs) {
	let win_rate = winners === 0 ? 0 : Math.round(winners / all_matchs * 100);
	let win_losses = all_matchs === 0 ? 0 : 100 - win_rate;
	return {win_rate, win_losses};
}
const Statistics = async(state) => {
	const pageContentContainer = document.querySelector('.page-content__container');
	try {
		const statistics_data = await fetchStatistics();
		const { win_rate, win_losses } = get_winRate(statistics_data.winners, statistics_data.all_matchs);
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
							<span class="metric-card__info__data font-body-extra-large">${statistics_data.all_matchs}</span>
						</div>
					</div>
					<div class="metric-card">
						<span class="material-icons-round metric-card__icon icon--extra-large">emoji_events</span>
						<div class="metric-card__info">
							<span class="metric-card__info__label font-body-medium">Total Victories</span>
							<span class="metric-card__info__data font-body-extra-large">${statistics_data.winners}</span>
						</div>
					</div>
					<div class="metric-card">
						<span class="material-icons-round metric-card__icon icon--extra-large">show_chart</span>
						<div class="metric-card__info">
							<span class="metric-card__info__label font-body-medium">Max. Consecutive Wins</span>
							<span class="metric-card__info__data font-body-extra-large">${statistics_data.max_consecutives}</span>
						</div>
					</div>
					<div class="metric-card">
						<span class="material-icons-round metric-card__icon icon--extra-large">flare</span>
						<div class="metric-card__info">
							<span class="metric-card__info__label font-body-medium">Total Points</span>
							<span class="metric-card__info__data font-body-extra-large">${statistics_data.all_points}</span>
						</div>
					</div>
				</div>
				<div class="page-content__container__content__line-metrics">
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Losses</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">${statistics_data.losses}</span>
					</div>
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Total Win Rate</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">${win_rate}%</span>
					</div>
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Total Lost Rate</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">${win_losses}%</span>
					</div>
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Average Points per Match</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">${statistics_data.average_points}</span>
					</div>
					<div class="metric-line">
						<span class="metric-line__label font-body-regular">Average Points Taken per Match</span>
						<div class="metric-line__line"></div>
						<span class="metric-line__data font-body-medium-bold">Um dia eu faço</span>
					</div>
				</div>
			</div>
	`;
	return pageContentContainer;

	} catch (error) {
		console.error(error);
	}
}

	export default Statistics;
