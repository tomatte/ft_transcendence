import createTournamentBrackets from "../scripts/element-creators/createTournamentBrackets.js";
import state from "../scripts/state/state.js";

const Tournament = () => {
    const {leftBrackets, rightBrackets} = createTournamentBrackets(state.tournament.players)

    const tournamentHTML = /* html */ `
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

            <div id="tournament-bracket-semi-left" class="Frame-10141">
                ${leftBrackets}
            </div>

            <div class="Frame-10144">
                 <div class="tournament-bracket">
                    <div class="player-bracket">
                        <img class="player-bracket__info__image" src="../../assets/images/players/tomatte.png" alt="Player Image"/>
                        <div class="player-bracket__info__text">
                            <span class="player-bracket__info__text__name font-body-medium-bold">Tomatte</span>
                            <span class="player-bracket__info__text__nickname font-body-regular">dbrandao</span>
                        </div>
                    </div>
                </div>
            </div>


            <div class="ImageFrame">
                <img src="../assets/images/tournament/trophy-dynamic-premium.png" alt="trophy">
            </div>


            <div class="Frame-10145">
                <div class="tournament-bracket">
                    <div class="player-bracket">
                        <img class="player-bracket__info__image" src="../../assets/images/players/tomatte.png" alt="Player Image"/>
                        <div class="player-bracket__info__text">
                            <span class="player-bracket__info__text__name font-body-medium-bold">Tomatte</span>
                            <span class="player-bracket__info__text__nickname font-body-regular">dbrandao</span>
                        </div>
                    </div>
                 </div>
            </div>

             <div class="Frame-10146">
                    ${rightBrackets}
                </div>
        </div>
            
    </div>


        <div class="Frame-10064">  
        
            <div class="Logo_otter">
                <img src="../assets/logo/combination-mark_white.svg" alt="Logo_otter">
            </div>
        
        </div>

    </div>
    `;

    return tournamentHTML;
};

export default Tournament;
