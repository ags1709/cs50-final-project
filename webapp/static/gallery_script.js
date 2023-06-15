let canvasSize = 600;
let galleryContainer = document.querySelector("#gallery-container");
galleryContainer.style.gridTemplateColumns = `repeat(2, ${canvasSize}px)`;
galleryContainer.style.gap = "100px 10vw";

let serverData;
let arrayOfCanvas = Array.from(document.querySelectorAll(".canvas"))

// Get data from server and process it
fetch('/api/data')
.then(response => response.json())
.then(data => {
    serverData = data;
    processServerData();
})
.catch(error => {
    console.error(error);
})


function processServerData() {
    galleryContainer.style.gridTemplateRows = `repeat(${serverData.length}, ${canvasSize}px)`;
    for (let i = 0; i < arrayOfCanvas.length; i++) {
        canvas = arrayOfCanvas[i];
        pixelData = JSON.parse(serverData[i]["pixeldata"]);
        gridSize = JSON.parse(serverData[i]["gridsize"])

        configureCanvas(canvas, gridSize);
        loadPixelArt(canvas, pixelData);
    }
}


function loadPixelArt(canvas, pixelData) {
    for (let j = 0; j < pixelData.length; j++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixel.style.backgroundColor = `${pixelData[j]}`;
        canvas.appendChild(pixel);
    }
}


function configureCanvas(canvas, gridsize) {
    pixelSize = (canvasSize - 2 ) / gridsize
    canvas.style.gridTemplateColumns = `repeat(${gridsize}, ${pixelSize}px)`
    canvas.style.gridTemplateRows = `repeat(${gridsize}, ${pixelSize}px)`
}


