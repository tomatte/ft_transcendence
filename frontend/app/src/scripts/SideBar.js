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


  

//   document.addEventListener("DOMContentLoaded", function() {
// 	const expandCollapseButton = document.querySelector(".ExpandCollapseButton");
// 	const sidebar = document.querySelector(".Sidebar");
  
// 	expandCollapseButton.addEventListener("click", function() {
// 	  sidebar.classList.toggle("collapsed");
// 	});
  
// 	expandCollapseButton.addEventListener("mouseenter", function() {
// 	  expandCollapseButton.classList.add("active");
// 	});
  
// 	expandCollapseButton.addEventListener("mouseleave", function() {
// 	  if (!sidebar.classList.contains("collapsed")) {
// 		expandCollapseButton.classList.remove("active");
// 	  }
// 	});
//   });
  