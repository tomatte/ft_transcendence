import { hideContents } from "../scripts/element-creators/utils.js";

const createBracket = (player) => {
    const html = /* html */ `
    <div class="player-bracket">
        <img class="player-bracket__info__image" src="${player.avatar}" alt="Player Image"/>
        <div class="player-bracket__info__text">
            <span class="player-bracket__info__text__name font-body-medium-bold">${player.username}</span>
            <span class="player-bracket__info__text__nickname font-body-regular">${player.nickname}</span>
        </div>
    </div>
`
    return html;
}

export  const injectPlayer = (player) => {
    const html = createBracket(player)
    const newPlayerBracket = document.getElementById('random-new-player-bracket')
    newPlayerBracket.innerHTML = html
    newPlayerBracket.style.display = "block"
    document.querySelector(".Footer-Searching").style.display = "none"
}

export const injectSearchMatchPage = (html) => {
    hideContents()
    const container = document.querySelector(".page-searching-match__container")
    container.innerHTML = html
    container.style.display = "block"
}

export const removeSearchMatchPage = () => {
    const container = document.querySelector(".page-searching-match__container")
    container.innerHTML = ""
    container.style.display = "none"
}

const SearchMatch = (player) => {
    const bracket = createBracket(player)
    const html = /* html */ `
    <div class="Bracket-Searching">
    
        <div class="stars1"></div>
        <div class="stars2"></div>
        <div class="Head-Frame">
            <div class="Middle-Searching">
                <h1 class="Searching-Title"> Searching for a match... </h1>
                <div class="Player-Search flex-md-row flex-column">
    
                    ${bracket}
    
                    <h1 class="versus-Search">VS</h1>
    
                    <div class="player-bracket player-bracket--waiting">
                        <span class="material-icons-round player-bracket__waiting-icon icon--small">schedule</span>
                        <span class="player-bracket__waiting-text font-body-regular">Waiting for player...</span>
                    </div>
    
                </div>
            </div>
        </div>
    
        <div id="random-new-player-bracket" class="player-bracket" style="display: none;">
        </div>
        <div class="Footer-Searching">
            <div class="Logo_otter">
                <img src="../assets/logo/combination-mark_white.svg" alt="Logo_otter">
            </div>
        </div>
    
    
    
    </div>
`

    return html
}

export default SearchMatch