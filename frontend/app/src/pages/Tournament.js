
const Tournament = () => {
    const pageContentContainer = document.createElement('div');
    pageContentContainer.classList.add('page-tournament__container');

    const tournamentHTML = `
        <div class="Brackets">  
            <div class="Frame-10140">  
                <button class="button button--secondary">
                    <span class="material-icons-round button__icon-left">arrow_back</span>
                    <span class="button__text font-body-regular-bold"> Leave tournament</span>
                </button>

                <button class="button button--tertiary">
                    <span class="material-icons-round button__icon-left">emoji_events</span>
                    <span class="button__text font-body-regular-bold"> Start the tournament</span>
                </button>
            </div>

            <div class="Frame-10139"> 
                <div class="Frame-10141">
                    <div class="tournament-bracket">
                        <img src="assets/images/players/wwag.png" alt="Avatar 1">
                        <p>Texto para tournament-bracket</p>
                    </div>

                    <div class="tournament-bracket">
                        <img src="assets/images/players/wwag.png" alt="Avatar 1">
                        <p>Texto para tournament-bracket</p>
                    </div>
                </div>

                <div class="Frame-10144">
                    <div class="tournament-bracket">
                        <img src="assets/images/players/wwag.png" alt="Avatar 1">
                        <p>Texto para tournament-bracket</p>
                    </div>
                </div>

                <div class="ImageFrame">
                    <img src="assets/images/tournament/trophy-dynamic-premium.png" alt="trophy">
                </div>

                <div class="Frame-10145">
                    <div class="tournament-bracket">
                        <img src="assets/images/players/wwag.png" alt="Avatar 1">
                        <p>Texto para tournament-bracket</p>
                    </div>
                </div>

                <div class="Frame-10146">
                    <div class="tournament-bracket">
                        <img src="assets/images/players/wwag.png" alt="Avatar 1">
                        <p>Texto para tournament-bracket</p>
                    </div>

                    <div class="tournament-bracket">
                        <img src="assets/images/players/wwag.png" alt="Avatar 1">
                        <p>Texto para tournament-bracket</p>
                    </div>
                </div>
            </div>

            <div class="Frame-10064">  
                <div class="Logo_otter">
                    <img src="assets/logo/combination-mark_white.svg" alt="Logo_otter">
                </div>
            </div>
        </div>
    `;

    pageContentContainer.innerHTML = tournamentHTML;

    return pageContentContainer;
};

export default Tournament;
