// Configurar a música de fundo
function setupOfBackgroundMusic() {
    var audio = document.getElementById('backgroundMusic');
    var musicPlaying = localStorage.getItem('backgroundMusicPlaying');

    // Iniciar a música se o estado em localStorage estiver definido como 'true' ou se não houver valor em localStorage
    if (musicPlaying === 'true' || musicPlaying === null) {
        localStorage.setItem('backgroundMusicPlaying', 'true');

        // O browser desabilita o AutoPlay sem interação com o usuário
        // Este código a seguir ajuda a amenizar esse problema
        // Desabilita o autoplay
        // audio.play();
        // Habilita o autoplay a partir de qualquer click
        document.body.addEventListener('click', () => {
            audio.play();
        }, { once: true });

    }
}

setupOfBackgroundMusic();

function playMenuItem() {
    var playing = localStorage.getItem('soundEffectsPlaying');

    if (playing === 'true' || playing === null) {
        var audio = new Audio('../assets/audios/menu-item.mp3');
        audio.play();
    }
}