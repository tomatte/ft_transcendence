import websocketMatch from "../websockets/websocketMatch.js"
import websocketTournament from "../websockets/websocketTournament.js"
import { showGamePage, showTournamentPage } from "./updateElements.js"
import { mockPlayers } from "../state/mockState.js"
import state from "../state/state.js"
import { goBackHome } from "./updateElements.js"
import { createTableLines } from "../../js/Friends.js"

export function hideContents() {
    document.querySelector(".sidebar").style.display = 'none'
    document.querySelector(".page-content").style.display = 'none'
}

export function injectElement(html, parent_id) {
    const parent = document.getElementById(parent_id)
    parent.innerHTML = html
}

export function diffOnlineAndQueue(online, queue) {
    return Object.values(online).filter(online_player => {
        return !queue.some((queue_player) => queue_player.username === online_player.username)
    });
}

export function listenForKeyPress(targetKey, callback) {
    function handleKeyPress(event) {
        if (event.key === targetKey) {
            callback();
        }
    }

    document.addEventListener('keydown', handleKeyPress);
}

export function listenButtonClick(parent, btnId, callback) {
    parent.addEventListener('click', function(event) {
        let targetElement = event.target;
        while (targetElement != null && targetElement !== this) {
            if (targetElement.id === btnId) {
                console.log(`${btnId} clicked`);
                callback()
                break;
            }
            targetElement = targetElement.parentNode;
        }
    });
}

export function addGoBackHomeButtonEventListener() {
    const parent = document.querySelector(".page-game-result__container")
    listenButtonClick(parent, "button-go-back-home", goBackHome)
}

export const fetchFriendRequests = async () => {
	const response = await fetch('https://localhost/api/users/get/friends-request-receive', { method: 'GET', credentials: 'include' });
	if (response.status != 200) throw new Error('Failed to fetch friends');
	return await response.json();
}

export const orderNotificationsByDate = (notifications) => {
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
}

export const updateStateFriendNotifications = async () => {
    const friendRequests = await fetchFriendRequests()
    if (friendRequests.length <= 0) return ;
    state.notifications = [...friendRequests, ...state.notifications]
    orderNotificationsByDate(state.notifications)
    if (state.currentPage == 'Notifications') { //TODO: change this to inject the html
        state.renderPage()
    }
}

export async function fetchFriends() {
	const response = await fetch('https://localhost/api/users/get/get-list-friends', { method: 'GET', credentials: 'include' });
	if (response.status != 200) throw new Error('Failed to fetch friends');
	return await response.json();
}

function setFriendsOnlineStatus() {
    state.friends.forEach(friend => {
        friend.online = friend.username in state.online_players;
    })
}

export const updateFriendsOnlineStatus = async () => {
    setFriendsOnlineStatus()
    console.log({panpan: state})
    if (state.currentPage == 'Friends') {
        const tableBody = document.querySelector('.page-content__container__content tbody');
        tableBody.innerHTML = createTableLines(state.friends)
    }
}

export const updateStateFriends = async () => {
    const friends = await fetchFriends()
    state.friends = friends
    updateFriendsOnlineStatus()
}
