/* TODO: change this filename */

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


const getMyProfile = () => {
	fetch('/api/users/get/my_user', { method: 'GET', credentials: 'include' })
	.then((response) => {
		return response.json();
	}).then((data) => {
		document.cookie = `nickname=${data.nickname}`;
		document.getElementById("profile-info-nickname").innerText = data.nickname;

		document.cookie = `avatar=${data.avatar}`;
		document.getElementById("profile-info-img").src = data.avatar;

		document.cookie = `username=${data.username}`;
		document.getElementById("profile-info-name").innerText = data.username;
	}).catch((error) => {console.log(error)});
}


async function logout() {
	document.cookie = 'sessionid=; expires=Thu, csrftoken=; 01 Jan 1970 00:00:00 UTC; path=/;';
	fetch('/api/users/logout', { method: 'GET', credentials: 'include' });
	window.location.href = '/';
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

const setButtonAddFriendSentStyle = (friend_username) => {
	const btnId = `button-add-friend-${friend_username}`
	const btn = document.getElementById(btnId)
	btn.innerHTML = `
		<span class="button__text font-body-regular-bold">Request sent!</span>
	`
	btn.style.cursor = 'default';
	btn.classList.remove('button--success');
	btn.classList.add('button--success-confirmation');
}

const fetchAddFriend = async (username) => {
	setButtonAddFriendSentStyle(username);
	const csrftoken = getCookie('csrftoken');
	const response = await fetch('/api/users/add/friend', {
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

const fetchAcceptFriendRequest = async (username) => {
	document.getElementById(`row-friend-${username}`).remove()
	const csrftoken = getCookie('csrftoken');
	const response = await fetch('/api/users/response/pedding-friend', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken
		},
		body: JSON.stringify({
			username: username,
			status: "accepted"
		})
	});
	if (response.status != 200) throw new Error('Failed to add friend');
}

const fetchRefuseFriendRequest = async (username) => {
	document.getElementById(`row-friend-${username}`).remove()
	const csrftoken = getCookie('csrftoken');
	const response = await fetch('/api/users/response/pedding-friend', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken
		},
		body: JSON.stringify({
			username: username,
			status: "declined"
		})
	});
	if (response.status != 200) throw new Error('Failed to add friend');
}

const sendDeleteFriendRequest = async (username) => {
	const csrftoken = getCookie('csrftoken');
	await fetch('/api/users/remove/friend', {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken
		},
		body: JSON.stringify({ username: username })
	});
	document.getElementById(`row-friend-${username}`).remove()
}

const fetchDeleteFriend = async (username) => {
	document.getElementById('div_to_modal_delete').innerHTML = generatoModalToDelete();
	const btnAcceptDelete = document.getElementById('button-accept-delete')
	btnAcceptDelete.addEventListener('click', () => sendDeleteFriendRequest(username));
	openModal('modalRemoveFriend')
}

const getAddFriendButton = (user) => {
	const toAdd = /* html */ `
		<button id="button-add-friend-${user.username}" class="button button--success" onclick="fetchAddFriend('${user.username}')">
			<span class="button__text font-body-regular-bold">Add friend</span>
		</button>
	`

	const pending = /* html */ `
		<button class="button button--success-confirmation" style="cursor: default;">
			<span class="button__text font-body-regular-bold">Request sent!</span>
		</button>
	`

	if (user.friend_status == "pending") return pending;
	return toAdd
}


const updateNickname = async (nickname) => {
	let body = {
		nickname: nickname
	}
	fetch('/api/users/uptate/uptade-nickname', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken')
		},
		body: JSON.stringify(body)
	}).then(() => {
		getMyProfile();
	});
}


const updateInformationSettings = () => {
	let nickname = document.getElementById('nicknameInput').value;
	if (nickname) {
		updateNickname(nickname);
	}
	let photoInput = document.getElementById('photoFile');
	if (photoInput && photoInput.files.length > 0) {
		let photo = photoInput.files[0];
		updatePhotoBack(photo);
	}
}


function uptadePhotoFront(file, id) {
	const reader = new FileReader()
	reader.onloadend = function () {
		document.getElementById(id).src = reader.result
	}
	if (file) {
		reader.readAsDataURL(file)
	}
}


function aux_uptadePhotoFront(event) {
	const file = event.files[0];
	const reader = new FileReader();

	reader.onloadend = function () {
		// Certifique-se de que o ID do elemento esteja definido corretamente
		document.getElementById('photo_settings').src = reader.result;
	}

	if (file) {
		reader.readAsDataURL(file);
	} else {
		// Opcional: lidar com o caso em que nenhum arquivo foi selecionado
		console.log("Nenhum arquivo selecionado");
	}
}


function updatePhotoBack(file) {
	const formData = new FormData();
	formData.append('file', file);
	fetch('/api/users/uptate/uptade-avatar', {
		method: 'POST',
		body: formData,
		credentials: 'include',
		headers: {
			'X-CSRFToken': getCookie('csrftoken')
		},
	}).then(() => {
		getMyProfile();

	}).catch((response) => console.log(response));
}


const generateListOfUsersToAdd = (usersList) => {
	usersList = usersList.filter((user) => user.friend_status != 'friend');
	usersList = usersList.filter((user) => user.username != getCookie('username'));
	return usersList.reduce((acc, user, index) => {
		const addFriendButton = getAddFriendButton(user)
		return acc + `
			<tr class="table-row">
				<td class="table-row__player">
					<div class="table-row__player__image-container">
						<img class="table-row__player__image" src="${user.avatar}" alt="player">
					</div>
					<div class="table-row__player__text">
						<span class="table-row__player__text__name font-body-medium-bold">${user.username}</span>
						<span class="table-row__player__text__nickname font-body-regular">${user.nickname}</span>
					</div>
				</td>
				<td class="table-row__data-default font-body-medium-bold">${index + 1}</td>
				<td class="table-row__actions">
					${addFriendButton}
				</td>
			</tr>
		`
	}, '')
}


async function fetchAllUsers() {
	const response = await fetch('/api/users/get/all_users', { method: 'GET', credentials: 'include' });
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
				<button type="button" onclick="closeModal('modalRemoveFriend')" class="button button--secondary">
					<span class="button__text font-body-regular-bold">No, cancel</span>
				</button>
				<button type="button" onclick="closeModal('modalRemoveFriend')" class="button button--danger" id="button-accept-delete">
					<span class="button__text font-body-regular-bold">Yes, remove friend</span>
				</button>
			</div>
		</div>
	`
}


const PageLogin = () => {
	return /* html */ `
	<div class="simula_body">
		<img class="stars_game1 star-login" src="assets/background-stars.svg" alt="Star Background 1">
		<img class="stars_game2 star-login" src="assets/background-stars.svg" alt="Star Background 2">
		<div class="login-container">
			<img class="login-container__logo" src="/assets/logo/combination-mark_white.svg" alt="logo logomark">
			<div class="login-container__content">

				<div class="login-container__content__info">
					<h1 class="login-container__content__info__title">Welcome, traveler!</h1>
					<span class="login-container__content__info__subtitle font-body-medium">Log-in with your 42 account to access the game</span>
				</div>

				<form class="login-form-button">
					<a class="button button--primary" id="login-42-button" href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9954ea12a766e3c5e958dede25fc19868a2da863a3b70188bbf1d9c952d8433b&redirect_uri=https%3A%2F%2Flocalhost%2Fapi%2Fauth&response_type=code">
						<img class="login-container__logo" src="/assets/logo/logo_42_white.svg" alt="logo logomark 42">
						<span class="button__text font-body-regular-bold">Login with 42</span>
					</a>
				</form>
			</div>
			<span class="login-container__credits-text font-body-regular">A project made by: etomiyos, dbrandao and clourenc, for 42 São Paulo</span>
		</div>
		<div class="login-carousel">
			<div id="carouselExampleIndicators" class="carousel slide carousel-fade">
				<div class="carousel-inner">
					<div class="carousel-item active">
						<img class="d-block w-100" src="./assets/images/login/login-carousel-slide-1.png" alt="Slide 1">
					</div>
					<div class="carousel-item">
						<img class="d-block w-100" src="./assets/images/login/login-carousel-slide-2.png" alt="Slide 2">
					</div>
					<div class="carousel-item">
						<img class="d-block w-100" src="./assets/images/login/login-carousel-slide-3.png" alt="Slide 3">
					</div>
					<div class="carousel-item">
						<img class="d-block w-100" src="./assets/images/login/login-carousel-slide-4.png" alt="Slide 4">
					</div>
					<div class="carousel-item">
						<img class="d-block w-100" src="./assets/images/login/login-carousel-slide-5.png" alt="Slide 5">
					</div>
					<div class="carousel-item">
						<img class="d-block w-100" src="./assets/images/login/login-carousel-slide-6.png" alt="Slide 6">
					</div>
				</div>
			</div>
		</div>
	</div>
	`
}


const cleanupPage = (show) => {
	let display = show === true ? 'block' : 'none';
	document.querySelector('.sidebar').style.display = display;
	document.querySelector('.page-content').style.display = display;
}

