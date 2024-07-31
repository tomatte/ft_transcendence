const generateNotificationsEmptyState = () => {
	return `
            <div class="page-content__container__empty-state"> 
            
                <img src="../assets/images/empty/megaphone-dynamic-clay.png" alt="Notification" class="empty-state-image">

                <div class="page-content__container__empty-state__info">
                    <h6 class="page-content__container__empty-state__info__title">No notifications</h6>
                    <span class="page-content__container__empty-state__info__description font-body-medium">Explore your notifications... Oh wait, there's nothing in 'otter space' yet! While you're here, why not check out the menu options on the left?</span>
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
