let ws_tournament = new WebSocket("wss://localhost:443/ws/tournament/")

function joinTournament(tournament_id) {
    payload.action = "join",
    payload.tournament_id = tournament_id
    ws_tournament.send(JSON.stringify(payload))
}

function createTournament() {
    document.getElementById("create").style.visibility = 'hidden'
    document.getElementById("creating").style.visibility = 'visible'
    
    payload.action = "create"
    ws_tournament.send(JSON.stringify(payload))
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
    ws_tournament.onmessage = (event) => {
        let data = JSON.parse(event.data)
            console.log(data)

        if (data.status == "enter_tournament") {
            payload.tournament_id = data.tournament_id
            document.getElementById("tournament_id").innerText = data.tournament_id
            addPlayerToList(data)
            return 
        }

        if (data.status == "update_players") {
            updatePlayers(data)
            return
        }
    };
}
