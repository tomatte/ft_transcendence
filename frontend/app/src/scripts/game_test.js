// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to set canvas dimensions
function setCanvasSize() {
    const minWidth = 800; // Minimum width for the canvas
    const maxWidth = 1600; // Maximum width for the canvas
    const maxHeight = 900; // Maximum height for the canvas

    // Calculate the desired width and height based on screen size
    let desiredWidth = Math.min(maxWidth, window.innerWidth);
    let desiredHeight = Math.min(maxHeight, window.innerHeight);

    if (desiredWidth < minWidth) {
        desiredWidth = minWidth;
    }

    // Apply the calculated dimensions to the canvas
    canvas.width = desiredWidth;
    canvas.height = desiredHeight;

    // Ensure the canvas remains centered
    canvas.style.left = `${(window.innerWidth - desiredWidth) / 2}px`;
    canvas.style.top = `${(window.innerHeight - desiredHeight) / 2}px`;

    // Redraw elements on the canvas
    drawPaddles();
    drawMiddleLine();
}

// Function to draw paddles
function drawPaddles() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set paddle styles
    ctx.fillStyle = '#FFFFFF'; // Paddle color
    ctx.fillRect(20, canvas.height / 2 - 50, 10, 100); // Left paddle position and size
    ctx.fillRect(canvas.width - 30, canvas.height / 2 - 50, 10, 100); // Right paddle position and size
}

// Function to draw the middle line
function drawMiddleLine() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.setLineDash([32, 32]); // Dotted line style

    // Calculate positions for the line
    const startX = canvas.width / 2;
    const startY = 0;
    const endX = canvas.width / 2;
    const endY = canvas.height;

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

// Event listener for window resize
window.addEventListener('resize', setCanvasSize);

// Initial call to set canvas size and draw elements
setCanvasSize();