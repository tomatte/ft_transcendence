export default () => {
    const container = document.createElement("div");
    container.classList.add("container");
    
    container.innerHTML = `
        <h1>Friends</h1>
        <p>Friends page content</p>
    `;


    
    return container; 
  }