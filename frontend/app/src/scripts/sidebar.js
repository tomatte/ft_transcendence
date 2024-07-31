document.addEventListener("DOMContentLoaded", function() {
    const menuControl = document.getElementById('menuControl');
    const sidebar = document.querySelector(".sidebar");

    menuControl.addEventListener("click", function() {
        sidebar.classList.toggle("collapsed");
    });
});


export function insertProfileInfoData() {
    let user = getCookie("username")
    if (!user) {
        return
    }

    const infoImg = document.getElementById("profile-info-img")
    infoImg.src = getCookie("avatar").replace(/^"|"$/g, '')

    const infoName = document.getElementById("profile-info-name")
    infoName.innerText = user

    const infoNickname = document.getElementById("profile-info-nickname")
    infoNickname.innerText = getCookie("nickname")
}
