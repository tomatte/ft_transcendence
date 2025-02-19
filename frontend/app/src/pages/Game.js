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
    
    document.body.appendChild(audioElement);
}

const Game = (state) => {
    hideContents()
    addGameStyles()
    addElements()

	const gameContainer = document.querySelector('.page-game__container');
    gameContainer.style.display = 'flex';

        gameContainer.innerHTML = /*html*/ `
        <img class="stars_game1 star-match" src="assets/background-stars.svg" alt="Star Background 1">
        <img class="stars_game2 star-match" src="assets/background-stars.svg" alt="Star Background 2">
        <img class="logo_match" src="assets/logo/logomark_white.svg">

        <div id="table">
            <h1 id="score_left">0</h1>
            <h1 id="score_right">0</h1>
            <div id="player_left" class="player"></div>
            <div class="middle_line"></div>
            <div id="ball"></div>
            <div id="player_right" class="player"></div>
        </div>
      `;

	  return gameContainer;
}

export default Game;


