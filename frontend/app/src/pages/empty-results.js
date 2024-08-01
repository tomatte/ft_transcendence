const generateResultsEmptyState = () => {
	return `
            <div class="page-content__container__empty-state"> 
            
                <img src="../assets/images/empty/puzzle-dynamic-clay.png" alt="Ranking" class="empty-state-image">

                <div class="page-content__container__empty-state__info">
                    <h6 class="page-content__container__empty-state__info__title">No results</h6>
                    <span class="page-content__container__empty-state__info__description font-body-medium">Remember to double-check everything carefully. We don't want any errors sneaking in and sending your data to 'otter space' instead of outer space!</span>
                </div>

                <div class="button">
                    <button class="button button--secondary empty-button">
                        <span class="button__text font-body-regular-bold">Clear search</span>
                    </button>
                </div>
            </div>
	`
}
