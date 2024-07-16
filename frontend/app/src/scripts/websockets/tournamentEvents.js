import tournamentEventHandler from "./tournamentEventHandler.js"

export let websocketTournament = new WebSocket("wss://localhost:443/ws/tournament/")

function joinTournament(tournament_id) {
    payload.action = "join",
    payload.tournament_id = tournament_id
    websocketTournament.send(JSON.stringify(payload))
}


function addPlayerToList(data) {
    const list = document.getElementById("players")
    const item = document.createElement("li")
    item.innerText = payload.player_id
    list.appendChild(item)
}

function updatePlayers(data) {
    const ul = document.getElementById("players")
    ul.innerHTML = ''
    players = data.players
    players.forEach((player) => {
        const li = document.createElement("li")
        li.innerText = player
        ul.appendChild(li)
    })
}

export default function listenTournamentEvents() {
    websocketTournament.onmessage = (event) => {
        let data = JSON.parse(event.data)
        console.log(data)
            
        tournamentEventHandler.execute(data)
    };
}
