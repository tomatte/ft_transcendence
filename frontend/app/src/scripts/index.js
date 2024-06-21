import routes from './router.js';

const container = document.querySelector('#root');

const renderPage = () => {
  const hash = window.location.hash.slice(1); 
  const page = hash || 'Home'; 

  if (routes[page]) {
    container.innerHTML = '';
    container.appendChild(routes[page]);
  } else {
    container.innerHTML = '<p>Página não encontrada</p>';
  }
};

const init = () => {
  window.addEventListener('hashchange', renderPage);
};

window.addEventListener('load', () => {
  renderPage();  
  init(); 
});
