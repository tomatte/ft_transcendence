import websocketGame from "../websockets/websocketGame.js"

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

export function listenTestKeys() {
    listenForKeyPress("1", () => websocketGame.listen())
}
