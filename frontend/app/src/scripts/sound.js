var playSound = true;

function toggleSound() {
    playSound = !playSound;
}

function playMenuItem() {
    if (playSound) {
        var audio = new Audio('../assets/audios/menu-item.mp3');
        audio.play();
    }
}

function toggleBackgroundMusic() {
    var audio = document.getElementById('backgroundMusic');
    if (audio) {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }
}