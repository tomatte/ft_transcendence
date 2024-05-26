function test() {
    const body = document.querySelector('body');

    const p = document.createElement('p');
    p.textContent = 'Hello from the SPA!';
    body.appendChild(p);
}

test();