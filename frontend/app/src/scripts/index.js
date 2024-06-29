import routes from './router.js';

const container = document.querySelector('.page-content__container');

const renderPage = () => {
  const hash = window.location.hash.slice(1); // Get the hash excluding the '#'
  const page = hash || 'Home'; // Default to 'Home' if hash is empty

  if (routes[page]) {
    container.innerHTML = ''; // Clear previous content
    container.appendChild(routes[page]()); // Render the selected page component
  } else {
    container.innerHTML = '<p>Página não encontrada</p>'; // Render a not found message
  }
};

const init = () => {
  window.addEventListener('hashchange', renderPage); // Listen for hash changes
};

window.addEventListener('load', () => {
  renderPage(); // Initial rendering based on current hash
  init(); // Initialize hashchange listener
});
