document.addEventListener("DOMContentLoaded", function() {
    const menuControl = document.getElementById('menuControl');
    const sidebar = document.querySelector(".sidebar");

    menuControl.addEventListener("click", function() {
        sidebar.classList.toggle("collapsed");
    });
});

export function insertProfileInfoData(user) {
    const infoImg = document.getElementById("profile-info-img")
    infoImg.src = user.avatar

    const infoName = document.getElementById("profile-info-name")
    infoName.innerText = user.username

    const infoNickname = document.getElementById("profile-info-nickname")
    infoNickname.innerText = user.nickname
}
