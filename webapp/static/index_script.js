let gridSize = 32;
let canvasSize = 600;
let pixelSize = canvasSize / gridSize;
pixelData = [] // Array to store pixeldata

let canvas = document.querySelector("#canvas");

// Define metadata
let title = "";
let pixelCount = gridSize ** 2;

// Configure canvas 
canvas.style.width = `${canvasSize}px`
canvas.style.height = `${canvasSize}px`
canvas.style.gridTemplateRows = `repeat(${gridSize}, ${pixelSize}px)`
canvas.style.gridTemplateColumns = `repeat(${gridSize}, ${pixelSize}px)`

// Add pixels to canvas
addPixels()

// Enable coloring pixels by clicking
canvas.addEventListener("mousedown", (e) => {
    e.preventDefault()
    if (e.target.classList.contains("pixel")) {
        e.target.style.backgroundColor = "#000000";
        updatePixelData(e.target);
    }
})
// Enable continous painting
canvas.addEventListener("mouseover", (e) => {
    e.preventDefault()
    if (e.buttons === 1 && e.target.classList.contains("pixel")) {
        e.target.style.backgroundColor = "#000000";
        updatePixelData(e.target);
    }
})

// Define function to fill canvas with pixels
function addPixels() {
    canvas.replaceChildren();
    pixelData = []; // Reset pixel data

    for (let i = 0; i < gridSize ** 2; i++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixelData.push("#FFFFFF");
        canvas.appendChild(pixel);
    }
}

function updatePixelData(pixel) {
    const index = Array.from(pixel.parentNode.children).indexOf(pixel);
    pixelData[index] = "#000000" // Update color of pixel
}