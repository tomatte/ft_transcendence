const Settings = () => {
    const pageContentContainer = document.querySelector('.page-content__container');

    if (!pageContentContainer) {
        console.error("Container not found");
        return;
    }

    pageContentContainer.innerHTML = `
            <div class="page-content__container__header">
                <div class="page-content__container__header__info">
                    <h4 class="page-content__container__header__info__title">Settings</h4>
                </div>

                <button class="button button--primary">
                    <span class="button__text font-body-regular-bold">Save changes</span>
                </button>
            </div>

            <div class="settings_content">

                <div class="page-content__container__content__setting">

                    <div class="page-content__container__content__setting__info">
                        <span class="page-content__container__content__setting__info__title font-body-medium-bold">Profile information</span>
                        <span class="page-content__container__content__setting__info__description font-body-medium">Customize your profile picture and change your name</span>
                    </div>
                    <div class="page-content__container__content__setting__control-name">
                        <div class="profile-picture">
                            <img class="profile-picture__image" src="../../assets/images/players/tomatte.png" alt="Player Image"/>
 
                            <button class="button button--outline">
                                <span class="button__text font-body-regular-bold">Update photo</span>
                            </button>
                        </div>
                        <div class="input-name">
                            <div class="input">
                                <span class="input__title">Name</span>
                                <input type="text" class="input__box font-body-regular" placeholder="Input your name...">
                                <span class="input__helper-text font-body-caption-regular">It must contain only letters and numbers</span>
                            </div>
                        </div>
                    </div>
                </div>      

                <div class="divider"></div>

                <div class="page-content__container__content__setting">
                    <div class="page-content__container__content__setting__info">
                        <span class="page-content__container__content__setting__info__title font-body-medium-bold">Controls</span>
                        <span class="page-content__container__content__setting__info__description font-body-medium">These settings are your navigation hub for seamless gameplay</span>
                    </div>
                    <div class="page-content__container__content__setting__control">
                        <div class="controls">
                            <span class="controls__type font-body-medium">Move up</span>
                            <div class="controls__actions">
                                <div class="keypad">
                                    <span class="keypad__control">W</span>
                                </div>
                                <div class="keypad">
                                    <span class="material-icons-round icon-large">arrow_upward</span>
                                </div>
                            </div>
                        </div>

                        <div class="controls">
                            <span class="controls__type font-body-medium">Move down</span>

                            <div class="controls__actions">
                                <div class="keypad">
                                    <span class="keypad__control">S</span>
                                </div>
                                <div class="keypad">
                                    <span class="material-icons-round icon-large">arrow_downward</span>
                                </div>
                            </div>
                        </div>
 
                    </div>
                </div>

                <div class="divider"></div>

                <div class="page-content__container__content__setting">
                    <div class="page-content__container__content__setting__info">
                        <span class="page-content__container__content__setting__info__title font-body-medium-bold">Sound</span>
                        <span class="page-content__container__content__setting__info__description font-body-medium">Toggle music and sound. Unlike space, here you can actually hear the action!</span>
                    </div>
                    <div class="page-content__container__content__setting__control">

                        <div class="sound-toggle">
                            <span class="sound__type font-body-medium">Music</span>
                            <div id="toggle1" class="toggle Active Enabled">
                                <input type="checkbox" id="toggle-checkbox" class="toggle-checkbox" checked>
                                <label for="toggle-checkbox" class="toggle-label">
                                    <span class="toggle-inner"></span>
                                    <span class="toggle-switch"></span>
                                </label>
                            </div>

                        </div>

                        <div class="sound-toggle">
                            <span class="sound__type font-body-medium">Sound effects</span>
                            <div id="toggle2" class="toggle Active Enabled">
                                <input type="checkbox" id="toggle-checkbox" class="toggle-checkbox" checked>
                                <label for="toggle-checkbox" class="toggle-label">
                                    <span class="toggle-inner"></span>
                                    <span class="toggle-switch"></span>
                                </label>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
    `;

    return pageContentContainer;
};

export default Settings;
