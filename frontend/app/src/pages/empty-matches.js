const generateMatchesEmptyState = () => {
	return `
            <div class="page-content__container__empty-state"> 
            
                <img src="../assets/images/empty/page-content__container__empty-state__image.png" alt="matches" class="empty-state-image">

                <div class="page-content__container__empty-state__info">
                    <h6 class="page-content__container__empty-state__info__title">No matches recorded</h6>
                    <span class="page-content__container__empty-state__info__description font-body-medium">Looks like your match record is as bare as a game without power-ups! Click 'Go home' to choose a mode and start scoring.</span>
                </div>

                <div class="button">
 
                    <button class="button button--secondary empty-button">
                        <span class="material-icons-round button__icon-left">arrow_back</span>
                        <span class="button__text font-body-regular-bold">Go back to Home</span>
                    </button>
                </div>
            </div>
	`
}
