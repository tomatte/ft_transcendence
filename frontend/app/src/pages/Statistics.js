export default () => {
  // Criação do contêiner principal
  const container = document.createElement("div");
  container.classList.add("playground-container");

  // Adição de estilos
  const style = document.createElement("style");
  style.innerHTML = `
      @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
      @import url('https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap');
      
      @import url('../css/components.css');
      @import url('../css/colors.css');
      @import url('../css/typography.css');
      @import url('../css/pages/statistics.css');
 
  `;

  // Conteúdo do contêiner principal para Statistics
  container.innerHTML = `
  

  `;

  container.appendChild(style);
  return container;
}
