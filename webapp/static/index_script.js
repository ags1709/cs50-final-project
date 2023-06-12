let gridSize = 32;
let canvasSize = 600;
let pixelSize = canvasSize / gridSize;


let canvas = document.querySelector("#canvas");

// Configure canvas 
canvas.style.width = `${canvasSize}px`
canvas.style.height = `${canvasSize}px`
canvas.style.gridTemplateRows = `repeat(${gridSize}, ${pixelSize}px)`
canvas.style.gridTemplateColumns = `repeat(${gridSize}, ${pixelSize}px)`



// Add pixels to canvas
for (let i = 0; i < gridSize**2; i++) {
    const pixel = document.createElement("div")
    pixel.classList.add("pixel");
    canvas.appendChild(pixel);
}

