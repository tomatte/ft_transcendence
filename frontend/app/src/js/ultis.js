function getCookieValue(name) {
	const cookies = document.cookie.split(';');
	for(let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith(name + '=')) {
			return cookie.substring(name.length + 1);
		}
	}
	return null;
}

const nickname = getCookieValue('nickname');
console.log(nickname);

export default getCookieValue;
