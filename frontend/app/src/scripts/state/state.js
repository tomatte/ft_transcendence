function getCookie(name) {
    let cookieArray = document.cookie.split(';')

    for(let i = 0; i < cookieArray.length; i++) {
        let cookiePair = cookieArray[i].split('=')
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1])
        }
    }
    return ""
}

function getUserInfo() {
    const user = {
        avatar: getCookie("avatar").replace(/^"|"$/g, ''),
        username: getCookie("username"),
        nickname: getCookie("nickname")
    }

    return user
}

const state = {
    user: {},
    notifications: [],
    online_players: [],
    friends: [],
}
export default state

export function initState() {
    state.user = getUserInfo()
}
