// function test() {
//     const body = document.querySelector('body');

//     const p = document.createElement('p');
//     p.textContent = 'Hello from the SPA!';
//     body.appendChild(p);
// }

// test();

document.addEventListener("DOMContentLoaded", function() {
	const expandCollapseButton = document.querySelector(".ExpandCollapseButton");
	const sidebar = document.querySelector(".Sidebar");
  
	expandCollapseButton.addEventListener("click", function() {
	  sidebar.classList.toggle("collapsed");
	});
  });