function addGameStyles() {
    const gameStyle = document.createElement('link');
    gameStyle.rel = 'stylesheet';
    gameStyle.href = 'css/pages/game.css';
    document.head.appendChild(gameStyle);    
}

function hideContents() {
    document.querySelector(".sidebar").style.display = 'none'
    document.querySelector(".page-content").style.display = 'none'
}

function addElements() {
    const audioElement = document.createElement('audio');
    audioElement.id = 'ball-kick';
    audioElement.src = 'assets/audios/soccer-kick-6235.mp3';
    
    const scriptElement = document.createElement('script');
    scriptElement.src = 'scripts/game.js';
    
    document.body.appendChild(audioElement);
    document.body.appendChild(scriptElement);    
}

const Game = () => {
    hideContents()
    addGameStyles()
    addElements()

	const pageContentContainer = document.querySelector('.page-game__container');

        pageContentContainer.innerHTML = `
        <img class="stars_game" src="assets/background-stars.svg">
        <img class="logo_match" src="assets/logo/logo_background_match.svg">

        <div id="table">
            <h1 id="score_left">0</h1>
            <h1 id="score_right">0</h1>
            <div id="player_left" class="player"></div>
            <div class="middle_line"></div>
            <div id="ball"></div>
            <div id="player_right" class="player"></div>
        </div>
      `;

	  return pageContentContainer;
}

export default Game;


