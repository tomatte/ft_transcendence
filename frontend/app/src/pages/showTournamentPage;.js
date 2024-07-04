const showTournamentPage = () => {
   const appContainer = document.querySelector('.page-tournament__container'); 
   
   // Supondo que Tournament() retorne um elemento HTML válido
   const tournamentPage = Tournament(); 
   
   // Verifica se appContainer existe antes de anexar o elemento
   if (appContainer) {
       appContainer.appendChild(tournamentPage);
   } else {
       console.error('App container not found!');
   }
};

export default showTournamentPage;

