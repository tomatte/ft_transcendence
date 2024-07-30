import { createBracketsSemi, createBracketsFinal } from "../scripts/element-creators/createTournamentBrackets.js";
import state from "../scripts/state/state.js";
import { goBackHome } from "../scripts/element-creators/updateElements.js";
import websocketTournament from "../scripts/websockets/websocketTournament.js";

export function addLeaveTournamentEventListener() {
    const btn = document.getElementById("button-leave-tournament")
    btn.addEventListener('click', () => {
        goBackHome()
        websocketTournament.client.close()
    })
}

const getStartTournamentButton = () => {
    const html = /* html */ `
        <button id="button-start-tournament" class="button button--tertiary">
            <span class="material-icons-round button__icon-left">emoji_events</span>
            <span class="button__text font-body-regular-bold"> Start the tournament</span>
                
        </button>
    `

    return state.tournament.isOwner ? html : "<span></span>"
}

const Tournament = () => {
    const {leftBrackets, rightBrackets} = createBracketsSemi(state.tournament.players)
    const {finalBracketLeft, finalBracketRight} = createBracketsFinal()
    const startTournamentButton = getStartTournamentButton()

    const tournamentHTML = /* html */ `
    <div class="brackets">
        <div class="bracket__header">  
            <button class="button button--secondary">
                <span class="material-icons-round button__icon-left">arrow_back</span>
                <span id="button-leave-tournament" class="button__text font-body-regular-bold"> Leave tournament</span>
                 
            </button>
            
            ${startTournamentButton}
        
            </div>

        <div class="bracket__content"> 

            <div id="tournament-bracket-semi-left" class="bracket__content__semifinal">
                    ${leftBrackets}
            </div>

            <div id="tournament-bracket-final-left" class="bracket__content__final">
                ${finalBracketLeft}
            </div>


            <div class="ImageFrame">
                <img src="../assets/images/tournament/trophy-dynamic-premium.png" alt="trophy">
            </div>


            <div id="tournament-bracket-final-right" class="bracket__content__final">
                ${finalBracketRight}
            </div>

            <div id="tournament-bracket-semi-right" class="bracket__content__semifinal">
                ${rightBrackets}
            </div>
            
        </div>


        <div class="bracket__footer">  
        
            <div class="Logo_otter">
                <img src="../assets/logo/combination-mark_white.svg" alt="Logo_otter">
            </div>
        
        </div>
    </div>
`;
    return tournamentHTML;
};

export default Tournament;
