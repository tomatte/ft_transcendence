import createOnlinePlayersTournamentRows from "./createOnlinePlayersTournament.js"
import createPlayerQueueTournament from "./createPlayerQueueTournament.js"
import { inviteToTournament, startTournament } from "../websockets/websocketActions.js"
import Tournament from "../../pages/Tournament.js"
import { createBracketsSemi, createBracketsFinal } from "./createTournamentBrackets.js"
import { injectElement, hideContents, diffOnlineAndQueue } from "./utils.js"
import state from "../state/state.js"
import Game from "../../pages/Game.js"
import createGameResult from "./createGameResult.js"
import { addLeaveTournamentEventListener } from "../../pages/Tournament.js"

function addButtonInvitationSentStyle(btn) {
    btn.innerText = "invitation sent!"
    btn.classList.remove("button--secondary")
    btn.classList.add("button--success-confirmation")
    btn.style.cursor = "default"
    btn.setAttribute('data-invitation-sent', 'true')
}

export function updateOnlinePlayersTournament(players) {
    if (!state.hasOwnProperty("tournament") || !state.tournament.hasOwnProperty("players")) {
        return 
    }

    const newOnline = diffOnlineAndQueue(players, state.tournament.players)
    const html = createOnlinePlayersTournamentRows(newOnline)
    injectElement(html, "tournament_online_players")
    
    for (let key in players) {
        const player = players[key]
        const btn = document.getElementById(`button-tournament-invite-${player.username}`)

        const buttonClickHandler = () => {
            if (btn.getAttribute('data-invitation-sent')) {
                return
            }
            inviteToTournament(player.username)
            addButtonInvitationSentStyle(btn)
            btn.removeEventListener('click', buttonClickHandler)
            state.tournament.invitedPlayers.push(player.username)
        }

        if (!btn) {
            continue
        }

        if (state.tournament.invitedPlayers.includes(player.username)) {
            addButtonInvitationSentStyle(btn)
        } else {
            btn.addEventListener('click', buttonClickHandler)
        }
    }
}

export function updatePlayersQueueTournament(players) {
    const html = createPlayerQueueTournament(players)
    injectElement(html, "tournament-player-queue")
    
    const statusHtml = `${players.length}/4 ready`
    injectElement(statusHtml, "tournament-status-ready")
}

export function showTournamentPage() {
    hideContents()
   const gameContainer = document.querySelector('.page-tournament__container'); 
    gameContainer.innerHTML = Tournament()
    addLeaveTournamentEventListener()
    gameContainer.style.display = "block"
};

export function updateTournamentBrackets(players) {
    const {leftBrackets, rightBrackets} = createBracketsSemi(players)

    document.getElementById("tournament-bracket-semi-left").innerHTML = leftBrackets
    document.getElementById("tournament-bracket-semi-right").innerHTML = rightBrackets
}

export function addStartTournamentClickEvent() {
    const btn = document.getElementById("button-start-tournament")
    if (btn) {
        btn.addEventListener('click', () => {
            console.log("start tournament")
            startTournament()
        })
    }
}

export function showGamePage() {
    hideContents()
    document.querySelector('.page-tournament__container').style.display = "none"
    Game()
}

export function showGameResult(data, goBack = true) {
    const html = createGameResult(data.player_left, data.player_right, goBack)

    const gameContainer = document.querySelector('.page-game__container')
    gameContainer.innerHTML = ""
    gameContainer.style.display = "none"

    const tournamentContainer = document.querySelector('.page-tournament__container')
    tournamentContainer.innerHTML = html
    tournamentContainer.style.display = "block"
}

export function showTournamentBracketFinal(data) {
    showTournamentPage()
    const {leftBrackets, rightBrackets} = createBracketsSemi(data.players)
    const {finalBracketLeft, finalBracketRight} = createBracketsFinal(data.final.player_left, data.final.player_right)

    document.querySelector('.page-game-result__container').style.display = "none"

    document.getElementById("tournament-bracket-semi-left").innerHTML = leftBrackets
    document.getElementById("tournament-bracket-semi-right").innerHTML = rightBrackets

    document.getElementById("tournament-bracket-final-left").innerHTML = finalBracketLeft
    document.getElementById("tournament-bracket-final-right").innerHTML = finalBracketRight
}

function removeResultStars() {
    document.querySelector(".stars1").classList.remove("stars-result");
    document.querySelector(".stars2").classList.remove("stars-result");
}

export function goBackHome() {
    document.querySelector('.page-game-result__container').style.display = "none"
    document.querySelector('.page-game__container').style.display = "none"
    document.querySelector('.page-tournament__container').style.display = "none"
    document.querySelector('.page-searching-match__container').style.display = "none"
    document.querySelector(".sidebar").style.display = 'flex'
    document.querySelector(".page-content").style.display = 'flex'
    removeResultStars()
    window.location.hash = "#Home"
    state.renderPage()
}
