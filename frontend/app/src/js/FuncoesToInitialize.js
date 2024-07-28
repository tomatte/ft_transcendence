var LIST_USERS_TO_ADD = [];


const getCookie = (name) => {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Verifica se o cookie começa com o nome que queremos
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}


async function logout() {
	document.cookie = 'sessionid=; expires=Thu, csrftoken=; 01 Jan 1970 00:00:00 UTC; path=/;';
	fetch('https://localhost/api/users/logout', { method: 'GET', credentials: 'include' });
	window.location.href = 'https://localhost/';
}


const filterUsers = () => {
	const searchInput = document.getElementById('search__add__friend').value;

	const filteredUsers = LIST_USERS_TO_ADD.filter((user) => {
		if (searchInput === '') return true;
		if (user.username.toLowerCase().includes(searchInput.toLowerCase())) return true;
		if (user.nickname.toLowerCase().includes(searchInput.toLowerCase())) return true;
		return false;
	});
	document.getElementById('body__modal__add__friend').innerHTML = generateListOfUsersToAdd(filteredUsers);
}


const fetchAddFriend = async (username) => {
	const csrftoken = getCookie('csrftoken');
	const response = await fetch('https://localhost:443/api/users/add/friend', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken
		},
		body: JSON.stringify({ username: username })
	});
	if (response.status != 200) throw new Error('Failed to add friend');
	return await response.json();
}


const fetchDeleteFriend = async (username) => {
	document.getElementById('div_to_modal_delete').innerHTML = generatoModalToDelete();
	document.getElementById('accepted-delete').addEventListener('click', async () => {
		const csrftoken = getCookie('csrftoken');
		const response = await fetch('https://localhost:443/api/users/remove/friend', {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken
			},
			body: JSON.stringify({ username: username })
		});
	});
	openModal('modalRemoveFriend')
}


const generateListOfUsersToAdd = (usersList) => {
	return usersList.reduce((acc, user, index) => {
		return acc + `
			<tr class="table-row">
				<td class="table-row__player">
					<img class="table-row__player__image" src="${user.avatar}" alt="player">
					<div class="table-row__player__text">
						<span class="table-row__player__text__name font-body-medium-bold">${user.username}</span>
						<span class="table-row__player__text__nickname font-body-regular">${user.nickname}</span>
					</div>
				</td>
				<td class="table-row__data-default font-body-medium-bold">${index + 1}</td>
				<td class="table-row__actions">
					<button class="game-row-option" onclick="fetchAddFriend('${user.username}')">
						<span class="material-icons-round game-row-option__icon">person_add</span>
					</button>
				</td>
			</tr>
		`
	}, '')
}


async function fetchAllUsers() {
	const response = await fetch('https://localhost/api/users/get/all_users', { method: 'GET', credentials: 'include' });
	if (response.status != 200) throw new Error('Failed to fetch friends');
	return await response.json();
}


const openModalToAdd = async () => {
	const modal = document.getElementById('modalAddFriend');
	modal.style.display = 'flex';
	modal.classList.add('modal--open');

	const modalBody = document.getElementById('body__modal__add__friend');
	fetchAllUsers().then((users) => {
		LIST_USERS_TO_ADD = users;
		modalBody.innerHTML = generateListOfUsersToAdd(users);
	});

	modalBody.innerHTML = `
		<div class="spinner"></div>
	`
}


const generatoModalToDelete = () => {
	return `
		<div class="modal modal--remove-friend" id="modalRemoveFriend">
			<div class="modal__header">
				<div class="modal__header__title">
					<div class="modal__header__title__text">
						<h4>Remove friend</h4>
					</div>
					<span onclick="closeModal('modalRemoveFriend')" class="material-icons-round modal__header__title__close icon--regular">close</span>
				</div>
				<span class="modal__header__description font-body-medium">
					Are you sure you want to remove this player as a friend? You can always send another request to the player, whenever you want.
				</span>
			</div>
			<div class="modal__actions">
				<button onclick="closeModal('modalRemoveFriend')" class="button button--secondary">
					<span class="button__text font-body-regular-bold">No, cancel</span>
				</button>
				<button class="button button--danger" id="accepted-delete">
					<span class="button__text font-body-regular-bold">Yes, remove friend</span>
				</button>
			</div>
		</div>
	`
}
