import routes from './router.js';

const container = document.querySelector('.page-content__container');
const sidebarMenuItems = document.querySelectorAll('.sidebar__menu-container .menu-item');

const renderPage = () => {
  const hash = window.location.hash.slice(1); // Get the hash excluding the '#'
  const page = hash || 'Home'; // Default to 'Home' if hash is empty

  sidebarMenuItems.forEach(item => {
    item.classList.remove('menu-item--active');
  });

  if (routes[page]) {
    container.innerHTML = ''; // Clear previous content
    container.appendChild(routes[page]()); // Render the selected page component
    
    // Find the corresponding menu item and add 'menu-item--active' class
    const menuItem = document.querySelector(`.sidebar__menu-container .menu-item a[href="/#${page}"]`);
    if (menuItem) {
        menuItem.parentElement.classList.add('menu-item--active');
    }
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


import routes from './router.js';

const container = document.querySelector('.page-content__container');
const sidebarMenuItems = document.querySelectorAll('.sidebar__menu-container .menu-item');

const renderPage = () => {
  const hash = window.location.hash.slice(1); // Get the hash excluding the '#'
  const page = hash || 'Home'; // Default to 'Home' if hash is empty

  sidebarMenuItems.forEach(item => {
    item.classList.remove('menu-item--active');
  });

  if (routes[page]) {
    container.innerHTML = ''; // Clear previous content
    container.appendChild(routes[page]()); // Render the selected page component
    
    // Find the corresponding menu item and add 'menu-item--active' class
    const menuItem = document.querySelector(`.sidebar__menu-container .menu-item a[href="/#${page}"]`);
    if (menuItem) {
      menuItem.parentElement.classList.add('menu-item--active');
    }
  } else {
    container.innerHTML = '<p>Página não encontrada</p>'; // Render a not found message
  }
};

const init = () => {
  window.addEventListener('hashchange', renderPage); // Listen for hash changes
  renderPage(); // Initial rendering based on current hash
};

window.addEventListener('load', init);
