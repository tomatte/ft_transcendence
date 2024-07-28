
const Settings = () => {
    const pageContentContainer = document.querySelector('.page-content__container');

    if (!pageContentContainer) {
        console.error("Container not found");
        return;
    }

    pageContentContainer.innerHTML = /*html*/ `
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
                        <form id="uploadForm" action="/upload_photo_endpoint" method="post" enctype="multipart/form-data" style="display: none;">
                            <input type="file" id="photoFile" name="photo" accept=".png, .jpg, .jpeg" title="Choose a profile photo">
                        </form>
                        <button id="updatePhotoBtn" class="button button--outline" onclick="document.getElementById('photoFile').click();">
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
                        <div class="toggle Active Enabled">
                            <input type="checkbox" class="toggle-checkbox" id="toggle-checkbox-1" checked aria-label="Enable Background Music">
                            <label for="toggle-checkbox-1" class="toggle-label">
                                <span class="toggle-inner"></span>
                                <span class="toggle-switch"></span>
                            </label>
                        </div>
                    </div>
                    <div class="sound-toggle">
                        <span class="sound__type font-body-medium">Sound effects</span>
                        <div class="toggle Active Enabled">
                            <input type="checkbox" class="toggle-checkbox" id="toggle-checkbox-2" checked aria-label="Enable Sound Effects">
                            <label for="toggle-checkbox-2" class="toggle-label">
                                <span class="toggle-inner"></span>
                                <span class="toggle-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="divider"></div>

            <div class="page-content__container__content__setting">
                <div class="page-content__container__content__setting__info">
                    <span class="page-content__container__content__setting__info__title font-body-medium-bold">Language</span>
                    <span class="page-content__container__content__setting__info__description font-body-medium"> Swap between the available languages</span>
                </div>
                <div class="page-content__container__content__setting__control">


                </div>
            </div>
        </div>
    `;

    document.getElementById('toggle-checkbox-1').checked = localStorage.getItem('backgroundMusicPlaying') === 'true';
    document.getElementById('toggle-checkbox-2').checked = localStorage.getItem('soundEffectsPlaying') === 'true';

    // Adicionar listeners
    document.querySelectorAll('.toggle-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const toggle = this.closest('.toggle');
            if (this.checked) {
                toggle.classList.remove('Default');
                toggle.classList.add('Active');
                
                // Reproduzir música se o checkbox de música estiver ativado
                if (this.id === 'toggle-checkbox-1') {
                    var audio = document.getElementById('backgroundMusic');
                    if (audio.paused) {
                        audio.play();
                    }
                    localStorage.setItem('backgroundMusicPlaying', 'true');
                }

                // Alternar som se o checkbox de som estiver alterado
                if (this.id === 'toggle-checkbox-2') {
                    localStorage.setItem('soundEffectsPlaying', true);
                }
            } else {
                toggle.classList.remove('Active');
                toggle.classList.add('Default');
                
                // Pausar música se o checkbox de música estiver desativado
                if (this.id === 'toggle-checkbox-1') {
                    var audio = document.getElementById('backgroundMusic');
                    if (!audio.paused) {
                        audio.pause();
                    }
                    localStorage.setItem('backgroundMusicPlaying', 'false');
                }

                // Alternar som se o checkbox de som estiver alterado
                if (this.id === 'toggle-checkbox-2') {
                    localStorage.setItem('soundEffectsPlaying', false);
                }
            }
        });

        // Set initial appearance of toggles based on checked state
        const toggle = checkbox.closest('.toggle');
        if (checkbox.checked) {
            toggle.classList.add('Active');
        } else {
            toggle.classList.add('Default');
        }
    });

    return pageContentContainer;
};

export default Settings;
