document.addEventListener("DOMContentLoaded", function() {
    const menuControl = document.getElementById('menuControl');
    const sidebar = document.querySelector(".sidebar");

    menuControl.addEventListener("click", function() {
        sidebar.classList.toggle("collapsed");
    });
});
