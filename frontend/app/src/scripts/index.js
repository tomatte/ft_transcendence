import routes from './router.js';
import websocketNotification from './websockets/websocketNotification.js'
import state from './state/state.js';
import { initState } from './state/state.js';
import modalCreateTournament from './modals/modalCreateTournament.js';
import { addGoBackHomeButtonEventListener } from './element-creators/utils.js';
import { updateStateFriendNotifications, updateStateFriends } from './element-creators/utils.js';


const container = document.querySelector('.page-content__container');
const sidebarMenuItems = document.querySelectorAll('.sidebar__menu-container .menu-item');

const renderPage = () => {
  const hash = window.location.hash.slice(1); // Get the hash excluding the '#'
  const page = hash || 'Home'; // Default to 'Home' if hash is empty
  state.currentPage = page

  sidebarMenuItems.forEach(item => {
    item.classList.remove('menu-item--active');
  });

  if (routes[page]) {
    container.innerHTML = ''; // Clear previous content
    routes[page](state); // Render the selected page component

    // Find the corresponding menu item and add 'menu-item--active' class
    const menuItem = document.querySelector(`.sidebar__menu-container .menu-item a[href="/#${page}"]`);
    if (menuItem) {
        menuItem.parentElement.classList.add('menu-item--active');
    }

    modalCreateTournament.listen()

} else {
    container.innerHTML = '<p>Página não encontrada</p>'; // Render a not found message
}
};

state.renderPage = renderPage

const listenHashChanges = () => {
  window.addEventListener('hashchange', renderPage);
};

window.addEventListener('load', () => {
  initState()
  websocketNotification.listen()
  getMyUser()
  renderPage();
  listenHashChanges();
  addGoBackHomeButtonEventListener()
  updateStateFriendNotifications()
  updateStateFriends()
});


const getMyUser = () => {
	fetch('/api/users/get/my_user', { method: 'GET', credentials: 'include' })
	.then((response) => {
    if (response.status != 200) {
      cleanupPage(false)
      document.body.innerHTML = PageLogin()
      $('#carouselExampleIndicators').carousel({
        interval: 6000,
        ride: 'carousel',
        pause: false
      });
    }
    else {
      return response.json();
    }
	}).then((data) => {
		document.cookie = `nickname=${data.nickname}`;
		document.getElementById("profile-info-nickname").innerText = data.username;

		document.cookie = `avatar=${data.avatar}`;
		document.getElementById("profile-info-img").src =  data.avatar;

    document.cookie = `username=${data.username}`;
		document.getElementById("profile-info-name").innerText = data.nickname;
	}).catch((error) => {console.log(error)});
}
