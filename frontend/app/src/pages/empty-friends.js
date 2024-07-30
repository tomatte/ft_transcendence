function checkAndReplaceContent() {
      const content = document.getElementById('.page-content__container');

      if (!content.innerHTML.trim()) {
        document.documentElement.innerHTML = `
                 <div class="page-content__container__empty-state"> 
            
                <img src="../assets/images/empty/mail-dynamic-clay.png" alt="Mail Dynamic Clay" class="empty-state-image">

                <div class="page-content__container__empty-state__info">
                    <h6 class="page-content__container__empty-state__info__title">No Friends Yet</h6>
                    <span class="page-content__container__empty-state__info__description font-body-medium">Whoops! Your friend list is currently in 'otter space'. Time to call some buddies by tapping the button below.</span>
                </div>

                <button class="button button--success empty-button">
                    <span class="button__text font-body-regular-bold">Add friend</span>
                </button>
                </div>
        `;
      }
    }

    window.onload = checkAndReplaceContent;

 
